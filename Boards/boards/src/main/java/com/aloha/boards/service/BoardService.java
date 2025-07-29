package com.aloha.boards.service;

import com.aloha.boards.domain.Boards;

public interface BoardService extends BaseService<Boards>{


    // 전체 삭제
    public boolean deleteAll() throws Exception;
}
