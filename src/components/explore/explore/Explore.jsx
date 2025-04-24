import '../styles/explore.scss'

import FileSaver from 'file-saver'
import JSZip from 'jszip'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {toast} from 'react-toastify'

import Code from './Code'
import Loading from './Loading'
import Tree from './Tree'
import {createTree, findRoot} from '../utils/Zip'
import {Col, Row} from "antd";

const Explore = forwardRef(function Explore({onClose, projectName, blob}, ref) {
  const [button, setButton] = useState('Copy')
  const [tree, setTree] = useState(null)
  const [selected, setSelected] = useState(null)


  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    onCopy, download, downloadZip
  }));

  useEffect(() => {
    const load = async () => {
      try {
        const zipJs = new JSZip()
        const {files} = await zipJs.loadAsync(blob).catch(() => {
          throw Error(`Could not load the ZIP project.`)
        })
        const path = `${findRoot({files})}/`
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
  }, [blob])

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
      {tree && selected ? (
        <div className='colset-explorer'>
          <Row>
            <Col span={6}>
              <div className='left'>
                <div className='head'>
                  <strong>{projectName}</strong>
                </div>
                <div className='explorer-content' style={{maxHeight: '400px', overflowY: "auto"}}>
                  <Tree
                    selected={selected}
                    onClickItem={item => {
                      setSelected(item)
                      // onSelected(item)
                    }}
                    tree={tree}
                  />
                </div>
              </div>
            </Col>
            <Col span={18}>
              <div className='right'>
                {selected && (
                  <>
                    <div className='head' style={{paddingLeft: '40px'}}>
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
                    <div className='explorer-content' style={{maxHeight: '400px', overflowY: "auto"}}>
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
    </div>
  )
});

Explore.defaultProps = {
  projectName: '',
  blob: null,
}

Explore.propTypes = {
  projectName: PropTypes.string,
  blob: PropTypes.instanceOf(Blob),
}

export default Explore
