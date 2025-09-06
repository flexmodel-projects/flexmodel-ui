import '../styles/explore.scss'

import FileSaver from 'file-saver'
import JSZip from 'jszip'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'

import Code from './Code'
import Loading from './Loading'
import Tree from './Tree'
import {createTree, findRoot} from '../utils/Zip'
import {Col, Divider, Row} from "antd";

const Explore = forwardRef(function Explore({onClose, projectName, blob}, ref) {
  const {t} = useTranslation()
  const [button, setButton] = useState(t('explore.copy'))
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
          throw Error(t('explore.could_not_load_zip'))
        })
        const path = `${findRoot({files})}/`
        const result = await createTree(files, path, path, zipJs).catch(() => {
          throw Error(t('explore.could_not_read_zip'))
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
  }, [blob, t])

  const onCopy = () => {
    setButton(t('explore.copied'))
    setTimeout(() => {
      setButton(t('explore.copy'))
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
                    <div className='head'>
                      <Row justify="space-between" align="middle">
                        <Col>
                          <strong>
                            {get(selected, 'filename')}
                          </strong>
                        </Col>
                        <Col>
                          <div className='actions'>
                            <a
                              href='/#'
                              onClick={e => {
                                e.preventDefault()
                                download(selected)
                              }}
                              className='action'
                            >
                              {t('explore.download')}
                            </a>
                            <Divider type="vertical" />
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
                                <Divider type="vertical" />
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
                                    ? t('explore.preview')
                                    : t('explore.view_source')}
                                </a>
                              </>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className='explorer-content' style={{ overflowY: "auto"}}>
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
