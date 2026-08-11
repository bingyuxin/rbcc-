package com.redbird.rbcc;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardItemRepository extends JpaRepository<BoardItem, Long> {
    List<BoardItem> findByItemTypeOrderBySortOrderAscIdAsc(String itemType);
}
