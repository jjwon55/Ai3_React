package com.aloha.boards.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.boards.domain.Boards;
import com.aloha.boards.domain.Files;
import com.aloha.boards.mapper.BoardMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardMapper boardMapper;

    @Autowired
    private FileService fileService;

    @Override
    public List<Boards> list() {
        return boardMapper.list();
    }

    @Override
    public PageInfo<Boards> list(int page, int size) {
        // 페이지 설정
        PageHelper.startPage(page, size);
        List<Boards> list = boardMapper.list();

        // PageInfo 생성
        PageInfo<Boards> pageInfo = new PageInfo<>(list);

        // 정렬 (created_at 내림차순 -> no 오름차순)
        pageInfo.getList().sort((t1, t2) -> {
            int dateCompare = t2.getCreatedAt().compareTo(t1.getCreatedAt()); // 최신글 먼저
            if (dateCompare != 0) {
                return dateCompare;
            }
            return t1.getNo().compareTo(t2.getNo()); // no 오름차순
        });

        return pageInfo;
    }

    @Override
    public Boards select(int no) {
        return boardMapper.select(no);
    }

    @Override
    public Boards selectById(String id) {
        return boardMapper.selectById(id);
    }

    @Override
    public boolean insert(Boards boards) {
        // 게시글 등록
        int result = boardMapper.insert(boards);
        // 파일 업로드
        result += upload(boards);
        return result > 0;
    }

    public int upload(Boards board) {
        int result = 0;
        String pTable = "boards";
        Long pNo = board.getNo();

        List<Files> uploadFileList = new ArrayList<>();

        MultipartFile mainFile = board.getMainFile();
        if (mainFile != null && !mainFile.isEmpty()) {
            Files mainFileInfo = new Files();
            mainFileInfo.setPTable(pTable);
            mainFileInfo.setPNo(pNo);
            mainFileInfo.setData(mainFile);
            mainFileInfo.setType("MAIN");
            uploadFileList.add(mainFileInfo);
        }
        List<MultipartFile> files = board.getFiles();
        if( files != null && !files.isEmpty() ) {
            for (MultipartFile multipartFile : files) {
                if( multipartFile.isEmpty() )
                    continue;
                Files fileInfo = new Files();
                fileInfo.setPTable(pTable);
                fileInfo.setPNo(pNo);
                fileInfo.setData(multipartFile);
                fileInfo.setType("SUB");
                uploadFileList.add(fileInfo);
            }
        }
        try {
            result += fileService.upload(uploadFileList);
        } catch (Exception e) {
            log.error("게시글 파일 업로드 중 에러 발생");
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public boolean update(Boards boards) {
        int result = boardMapper.update(boards);

        result += upload(boards);
        return result > 0;
    }

    @Override
    public boolean updateById(Boards boards) {
        int result = boardMapper.updateById(boards);

        Boards oldBoard = boardMapper.selectById(boards.getId());
        boards.setNo(oldBoard.getNo());
        result += upload(boards);
        return result > 0;
    }

    @Override
    public boolean delete(int no) {
        // 게시글 삭제
        int result = boardMapper.delete(no);

        // 종속된 첨부파일 삭제
        Files file = new Files();
        file.setPTable("boards");
        file.setPNo(Long.valueOf(no));
        int deleteCount = fileService.deleteByParent(file);
        log.info(deleteCount + " 개의 파일이 삭제 되었습니다.");
        return result > 0;
    }

    @Override
    public boolean deleteById(String id) {
        // 게시글 삭제
        int result  = boardMapper.deleteById(id);
        // 종속된 첨부파일 삭제
        Boards board = boardMapper.selectById(id);
        Long no = board.getNo();
        Files file = new Files();
        file.setPTable("boards");
        file.setPNo(Long.valueOf(no));
        int deleteCount = fileService.deleteByParent(file);
        log.info(deleteCount + " 개의 파일이 삭제 되었습니다.");
        return result > 0;
    }


}
