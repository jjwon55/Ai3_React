package com.aloha.boards.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.boards.domain.Boards;
import com.aloha.boards.mapper.BoardMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Service
public class BoardServiceImpl implements BoardService {

   @Autowired private BoardMapper boardMapper;

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
    public Boards select(Long no) {
        return boardMapper.select(no);
    }

    @Override
    public Boards selectById(String id) {
        return boardMapper.selectById(id);
    }

    @Override
    public boolean insert(Boards entity) {
        return boardMapper.insert(entity) > 0;
    }

    @Override
    public boolean update(Boards entity) {
        return boardMapper.update(entity) > 0;
    }

    @Override
    public boolean updateById(Boards entity) {
        return boardMapper.updateById(entity) > 0;
    }

    @Override
    public boolean delete(Long no) {
        return boardMapper.delete(no) > 0;
    }

    @Override
    public boolean deleteById(String id) {
        return boardMapper.deleteById(id) > 0;
    }


    @Override
    public boolean deleteAll() throws Exception {
        return boardMapper.deleteAll() > 0;
    }
    
}
    

