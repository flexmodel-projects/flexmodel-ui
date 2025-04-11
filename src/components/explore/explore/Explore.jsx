import '../styles/explore.scss'

import FileSaver from 'file-saver'
import JSZip from 'jszip'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import React, {useEffect, useState} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {toast} from 'react-toastify'

import Code from './Code'
import Loading from './Loading'
import Tree from './Tree'
import {createTree, findRoot} from '../utils/Zip'
import {Col, Modal, Row} from "antd";

function Explore({ open, onClose, projectName, blob }) {
  const [button, setButton] = useState('Copy')
  const [tree, setTree] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const zipJs = new JSZip()
        const { files } = await zipJs.loadAsync(blob).catch(() => {
          throw Error(`Could not load the ZIP project.`)
        })
        const path = `${findRoot({ files })}/`
        const result = await createTree(files, path, path, zipJs).catch(() => {
          throw Error(`Could not read the ZIP project.`)
        })
        setSelected(result.selected)
        setTree(result.tree)
      } catch (e) {
        // dispatch({ type: 'EXPLORE_UPDATE', payload: { open: false } })
        console.error(e)
        toast.error(e.message)
      }
    }
    if (blob) {
      load()
    }
  }, [ blob])

  const onCopy = () => {
    setButton('Copied!')
    setTimeout(() => {
      setButton('Copy!')
    }, 3000)
  }

  const download = file => {
    const blobFile = new Blob([file.content], {
      type: 'text/plain;charset=utf-8',
    })
    FileSaver.saveAs(blobFile, file.filename)
  }

  const downloadZip = () => {
    FileSaver.saveAs(blob, projectName)
  }

  return (
    <div>
      <Modal
        width={1000}
        open={open}
        onOk={() => {
          setSelected(null)
          onClose()
        }}
        onCancel={() => {
          setSelected(null)
          onClose()
        }}
        showCloseIcon={false}
        classNames={{modal: 'modal-explorer', overlay: 'overlay'}}
      >
        {tree && selected ? (
          <div className='colset-explorer'>
            <Row>
              <Col span={6}>
                <div className='left'>
                  <div className='head'>
                    <strong>{projectName}</strong>
                  </div>
                  <div className='explorer-content'>
                    <Tree
                      selected={selected}
                      onClickItem={item => {
                        setSelected(item)
                        // onSelected(item)
                      }}
                      tree={tree}
                    />
                  </div>
                  <div className='foot'>
                    <a
                      href='/#'
                      onClick={e => {
                        e.preventDefault()
                        downloadZip()
                      }}
                      className='action'
                    >
                      下载源码包
                    </a>
                  </div>
                </div>
              </Col>
              <Col span={18}>
                <div className='right'>
                  {selected && (
                    <>
                      <div className='head'  style={{paddingLeft: '30px'}}>
                        <strong>
                          {get(selected, 'filename')}
                        </strong>
                        <div className='actions'>
                          <a
                            href='/#'
                            onClick={e => {
                              e.preventDefault()
                              download(selected)
                            }}
                            className='action'
                          >
                            Download
                          </a>
                          <span className='divider'>|</span>
                          <CopyToClipboard
                            onCopy={onCopy}
                            text={get(selected, 'content', '')}
                          >
                            <a
                              href='/#'
                              onClick={e => {
                                e.preventDefault()
                              }}
                              className='action'
                            >
                              {button}
                            </a>
                          </CopyToClipboard>
                          {get(selected, 'language') === 'markdown' && (
                            <>
                              <span className='divider'>|</span>
                              <a
                                href='/#'
                                onClick={e => {
                                  e.preventDefault()
                                  const newSelected = {...selected}
                                  newSelected.force = !get(selected, 'force', false)
                                  setSelected(newSelected)
                                }}
                                className='action'
                              >
                                {get(selected, 'force', false)
                                  ? 'Preview'
                                  : 'View source'}
                              </a>
                            </>
                          )}
                        </div>

                      </div>
                      <div className='explorer-content'>
                        <Code item={selected} onChange={() => {
                        }}/>
                      </div>
                    </>
                  )}
                </div>
              </Col>
            </Row>


          </div>
        ) : (
          <Loading onClose={onClose}/>
        )}
      </Modal>
    </div>
  )
}

Explore.defaultProps = {
  projectName: '',
  blob: null,
}

Explore.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  projectName: PropTypes.string,
  blob: PropTypes.instanceOf(Blob),
}

export default Explore
