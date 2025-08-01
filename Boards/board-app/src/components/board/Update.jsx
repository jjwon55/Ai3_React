import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './css/Update.module.css'
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Checkbox from '@mui/material/Checkbox';
// ckeditor5
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Update = ({ board, onUpdate, onDelete, fileList, onDownload, onDeleteFile, deleteCheckedFiles }) => {

  const { id } = useParams()

  // 🧊 state
  const [title, setTitle] = useState('')
  const [writer, setWriter] = useState('')
  const [content, setContent] = useState('')
  const [fileIdList, setFileIdList] = useState([]) // 선택 삭제 id 목록
  const [mainFile, setMainFile] = useState(null)
  const [files, setFiles] = useState(null)

  // 변경 이벤트 함수
  const changeTitle = (e) => { setTitle(e.target.value) }
  const changeWriter = (e) => { setWriter(e.target.value) }
  const changeContent = (e) => { setContent(e.target.value) }

  useEffect(() => {
    if (board) {
      setTitle(board.title)
      setWriter(board.writer)
      setContent(board.content)
    }
  }, [board])

  // 수정 함수
  const onSubmit = () => {
    const data = {
      'id': id,
      'title': title,
      'writer': writer,
      'content': content
    }
    const headers = { 'Content-Type': 'application/json' }

    onUpdate(data, headers)

  }

  const handleDelete = () => {
    const check = window.confirm('정말로 삭제하시겠습니까?')
    if (check)
      onDelete(id)
  }
  // 선택 삭제 핸들러 
  const hadndleCheckedFileDelete = (id) => {
    const check = window.confirm(`선택한 ${fileIdList.length} 개의 파일을 삭제하시겠습니까?`)
    if (check) {
      deleteCheckedFiles(id)
      setFileIdList([])
    }
  }

  // ✅ 파일 선태 핸들러
  const checkFileId = (id) => {
    console.log(id);

    let checked = false
    // 체크 여부 확인
    for (let i = 0; i < fileIdList.length; i++) {
      const fileId = fileIdList[i];
      // 체크 ✅
      if (fileId == id) {
        fileIdList.splice(i, 1)
        checked = true
      }

    }
    // 체크 ❌ ➡ 체크박스 지정 ✅
    if (!checked) {
      fileIdList.push(id)

    }
    console.log(`체크한 아이디 : ${fileIdList}`);
    setFileIdList(fileIdList)
  }
  // 파일 삭제 핸들러
  const handleFileDelete = (id) => {
    const check = window.confirm('파일을 삭제하시겠습니까?')
    if (check)
      onDeleteFile(id)
  }

  return (
    <div className="container">
      <h1 className="title">게시글 수정</h1>
      <table className={styles.table} border={1}>
        <tr>
          <th>제목</th>
          <td>
            <input type="text" onChange={changeTitle} value={title} className={styles[`form-input`]} />
          </td>
        </tr>
        <tr>
          <th>작성자</th>
          <td>
            <input type="text" onChange={changeWriter} value={writer} className={styles[`form-input`]} />
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            {/* <textarea cols={40} rows={10} onChange={changeContent} value={content} className={styles[`form-input`]}></textarea> */}
            <CKEditor
              editor={ClassicEditor}
              config={{
                placeholder: "내용을 입력하세요.",
                toolbar: {
                  items: [
                    'undo', 'redo',
                    '|', 'heading',
                    '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                    '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                    '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent',
                    '|', 'link', 'uploadImage', 'blockQuote', 'codeBlock',
                    '|', 'mediaEmbed',
                  ],
                  shouldNotGroupWhenFull: false
                },
                editorConfig: {
                  height: 500, // Set the desired height in pixels
                },
                alignment: {
                  options: ['left', 'center', 'right', 'justify'],
                },

                // extraPlugins: [uploadPlugin]            // 업로드 플러그인
              }}
              data={board.content}         // ⭐ 기존 컨텐츠 내용 입력 (HTML)
              onReady={editor => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
                setContent(data);
              }}
              onBlur={(event, editor) => {
                console.log('Blur.', editor);
              }}
              onFocus={(event, editor) => {
                console.log('Focus.', editor);
              }}
            />
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            {
              fileList.map((file) => (
                <div className="flex-box" key={file.id}>
                  <div className="item">
                    {/* <input type="checkbox" onChange={ ()  => checkFileId(file.id)}  /> */}
                    <Checkbox onChange={() => checkFileId(file.id)} />
                    <div className="item-img">
                      {file.type == 'MAIN' && <span className='badge'>대표</span>}
                      <img src={`/api/files/img/${file.id}`} alt={file.originName} className='file-img' />
                    </div>
                    <span>{file.originName} ({file.fileSize})</span>
                  </div>
                  <div className="item">
                    <button className="btn" onClick={() => onDownload(file.id, file.originName)}>
                      <DownloadIcon /></button>
                    <button className="btn" onClick={() => handleFileDelete(file.id)}>
                      <DeleteForeverIcon /></button>
                  </div>
                </div>
              ))
            }
          </td>
        </tr>
      </table>
      <div className="btn-box">
        <div>
          <Link to="/boards" className='btn'>목록</Link>
          <button className="btn" onClick={hadndleCheckedFileDelete}>선택 삭제</button>
        </div>
        <div>
          <button onClick={onSubmit} className="btn">수정</button>
          <button onClick={handleDelete} className="btn">삭제</button>
        </div>
      </div>
    </div>
  )
}

export default Update