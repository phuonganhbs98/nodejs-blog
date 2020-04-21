# Gồm 2 phần là container Node và container mongodb

## Dockerfile

dùng để build images node_server

Build trên image node:10-alpine

WORKDIR /usr/src/app : config đường dẫn đến file làm việc

COPY package\*.json ./ : copy package.json

RUN npm install : install node_module

COPY . . : copy các file ở thư mục hiện tại vào WORKDIR

EXPOSE 3000 : config port

## docker-compose

dùng version 3:

Gồm 2 service :node_server và mongo

### node_server

- build images từ file Dockerfile
- restart: unless-stopped : config container sẽ chỉ dừng khi chạy các lệnh down (đồng nghĩa với việc kể cả tắt máy thì lần sau bật các container cũng đã chạy cùng khi khởi động)
- working_dir: /usr/src/app giống trong Dockerfile
- volume : map các file ở ngoài vào trong container khi file ở ngoài thay đổi ở trong cũng thay đổi và ngược lại
- ports: map cổng 3000 trong container ra localhost:3000
- depends_on : config phụ thuộc vào container mongo chạy rồi thì mới chạy
- networks : network giữa 2 container
- command : lệnh chạy

### mongo

- image :mongo : dùng images mongo nếu ko có tự tải xuống từ mạng
- restart: unless-stopped : config container sẽ chỉ dừng khi chạy các lệnh down (đồng nghĩa với việc kể cả tắt máy thì lần sau bật các container cũng đã chạy cùng khi khởi động)
- ports : map cổng 27017 ra localhost 27017 để có thể dùng tool để xem
- environment config các biến environment của database
- volumes: map file lưu trong mongo ra ngoài như thế khi khởi động lại không mất dữ liệu trong những lần chạy trước (muốn xóa phải cấp quyển sudo)

### network : config network giữa 2 container đặt tên là app-network

## Run

Lệnh run :

```sh
docker-compose up
```

Lệnh dừng :

```sh
docker-compose down
```

Lệnh đọc log trong từng container :

```sh
docker logs -f --details containerName
```

## chú ý

trong config database trong index.js sửa

```js
'mongodb://localhost:27017/blog';
// thành
'mongodb://mongo:27017/blog';
// trong đó mongo là tên của container
```

.gitignore

```js
// thêm để ko đẩy cả data lên github
user_data/
```
