INSERT INTO boards (id, title, writer, content)
SELECT UUID(), title, writer, content
FROM boards;

DROP TABLE IF EXISTS `files`;
