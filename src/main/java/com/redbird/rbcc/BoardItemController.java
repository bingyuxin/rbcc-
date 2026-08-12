package com.redbird.rbcc;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import jakarta.servlet.http.HttpSession;
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
    private final AccountRepository accountRepository;
    private final ObjectMapper objectMapper;

    public BoardItemController(BoardItemRepository repository, AccountRepository accountRepository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.accountRepository = accountRepository;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/snapshot")
    public Map<String, List<JsonNode>> snapshot(HttpSession session) {
        Map<String, List<JsonNode>> result = new LinkedHashMap<>();
        repository.findByAccountIdOrderByItemTypeAscSortOrderAscIdAsc(accountId(session)).forEach(item -> {
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
    @Transactional
    public ResponseEntity<Void> replaceSnapshot(@RequestBody Map<String, List<JsonNode>> snapshot, HttpSession session) {
        Account account = account(session);
        repository.deleteByAccountId(account.getId());
        snapshot.forEach((type, items) -> {
            int order = 0;
            for (JsonNode payload : items) {
                BoardItem item = new BoardItem();
                item.setAccount(account);
                item.setItemType(type);
                item.setPayload(payload.toString());
                item.setSortOrder(order++);
                repository.save(item);
            }
        });
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{type}")
    public List<JsonNode> list(@PathVariable String type, HttpSession session) {
        return repository.findByAccountIdAndItemTypeOrderBySortOrderAscIdAsc(accountId(session), type).stream().map(this::payloadAsJson).toList();
    }

    @PostMapping("/{type}")
    public JsonNode create(@PathVariable String type, @RequestBody JsonNode payload, HttpSession session) {
        BoardItem item = new BoardItem();
        item.setAccount(account(session));
        item.setItemType(type);
        item.setPayload(payload.toString());
        item.setSortOrder(repository.findByAccountIdAndItemTypeOrderBySortOrderAscIdAsc(accountId(session), type).size());
        return saveAndRead(item);
    }

    @PutMapping("/{id}")
    public JsonNode update(@PathVariable Long id, @RequestBody JsonNode payload, HttpSession session) {
        BoardItem item = repository.findById(id).orElseThrow(() -> notFound());
        ensureOwner(item, session);
        item.setPayload(payload.toString());
        return saveAndRead(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpSession session) {
        BoardItem item = repository.findById(id).orElseThrow(() -> notFound());
        ensureOwner(item, session);
        repository.delete(item);
        return ResponseEntity.noContent().build();
    }

    private JsonNode saveAndRead(BoardItem item) {
        return payloadAsJson(repository.save(item));
    }

    private JsonNode payloadAsJson(BoardItem item) {
        try {
            return objectMapper.readTree(item.getPayload());
        } catch (JsonProcessingException error) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid board payload", error);
        }
    }

    private Account account(HttpSession session) {
        return accountRepository.getReferenceById(accountId(session));
    }

    private Long accountId(HttpSession session) {
        Object value = session.getAttribute(AuthController.USER_ID_KEY);
        if (value instanceof Long id) return id;
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "请先登录");
    }

    private void ensureOwner(BoardItem item, HttpSession session) {
        if (!item.getAccount().getId().equals(accountId(session))) {
            throw notFound();
        }
    }

    private ResponseStatusException notFound() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Board item not found");
    }
}
