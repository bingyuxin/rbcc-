package com.redbird.rbcc;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class BoardItemController {
    private final BoardItemRepository repository;
    private final ObjectMapper objectMapper;

    public BoardItemController(BoardItemRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/snapshot")
    public Map<String, List<JsonNode>> snapshot() {
        Map<String, List<JsonNode>> result = new LinkedHashMap<>();
        repository.findAll().forEach(item -> {
            try {
                result.computeIfAbsent(item.getItemType(), ignored -> new java.util.ArrayList<>())
                        .add(objectMapper.readTree(item.getPayload()));
            } catch (JsonProcessingException error) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid board payload", error);
            }
        });
        return result;
    }

    @PutMapping("/snapshot")
    public ResponseEntity<Void> replaceSnapshot(@RequestBody Map<String, List<JsonNode>> snapshot) {
        repository.deleteAllInBatch();
        snapshot.forEach((type, items) -> {
            int order = 0;
            for (JsonNode payload : items) {
                BoardItem item = new BoardItem();
                item.setItemType(type);
                item.setPayload(payload.toString());
                item.setSortOrder(order++);
                repository.save(item);
            }
        });
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{type}")
    public List<JsonNode> list(@PathVariable String type) {
        return repository.findByItemTypeOrderBySortOrderAscIdAsc(type).stream().map(item -> {
            try {
                return objectMapper.readTree(item.getPayload());
            } catch (JsonProcessingException error) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid board payload", error);
            }
        }).toList();
    }

    @PostMapping("/{type}")
    public JsonNode create(@PathVariable String type, @RequestBody JsonNode payload) {
        BoardItem item = new BoardItem();
        item.setItemType(type);
        item.setPayload(payload.toString());
        item.setSortOrder(repository.findByItemTypeOrderBySortOrderAscIdAsc(type).size());
        return saveAndRead(item);
    }

    @PutMapping("/{id}")
    public JsonNode update(@PathVariable Long id, @RequestBody JsonNode payload) {
        BoardItem item = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board item not found"));
        item.setPayload(payload.toString());
        return saveAndRead(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Board item not found");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private JsonNode saveAndRead(BoardItem item) {
        try {
            return objectMapper.readTree(repository.save(item).getPayload());
        } catch (JsonProcessingException error) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid board payload", error);
        }
    }
}
