const server = require('http').createServer();
const io = require('socket.io')(server);
import Event from './event';
import Room from './room';
const room = new Room('1', '激情聊天室');
io.on('connection', client => {
  client.on(Event.LOGIN, name => {
    console.log('login', name);
    if(room.getUserByName(name)){
      client.emit(Event.ROOM, '有同名用户在聊天室，请换一个名字');
    }else{
      room.join(client).then( e =>{
        console.log('room', e, name);
        client.name = name;
        const obj = { user:name, type:'join', room:room.name, users:room.getUsers(), time: new Date().getTime()};
        client.to(room.id).emit(Event.ROOM, obj);
        client.emit(Event.ROOM, Object.assign({self:true}, obj));
      }).catch( e => console.log(e) );
    }
  });
  client.on(Event.TALK, e => {
    console.log('talk', e);
    let obj = Object.assign({from:client.name, time: new Date().getTime()}, e);
    client.emit(Event.TALK, Object.assign({self:true}, obj));
    if(e.to) {
      const to = room.getUserByName(e.to);
      if (to) to.emit(Event.TALK, obj);
    } else {
      client.to(room.id).emit(Event.TALK, obj);
    }
  });
  client.on('disconnect', () => {
    console.log('disconnect', client.name, room.name);
    room.leave(client).then( e => {
      client.to(room.id).emit(Event.ROOM, { user:client.name, type:'leave', room:room.name, users:room.getUsers(), time: new Date().getTime()});
    }).catch( e => console.log(e) );
  });
});
server.listen(4001);