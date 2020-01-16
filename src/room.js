export default class Room {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.users = [];
  }
  /**
   * 根据名字获得用户
   * @param {string} name 
   */
  getUserByName(name) {
    return this.users.find( p => p.name == name);
  }
  /**
   * 获取聊天室内所有用户
   * @returns {Array} 用户名数组
   */
  getUsers() {
    const arr = [];
    this.users.forEach(i => {
      arr.push(i.name);
    });
    return arr;
  }
  /**
   * 用户加入房间
   * @param {Client} user 
   */
  join(user) {
    return new Promise((resolve, reject) => {
      user.join(this.id, e =>{
        if(e){
          reject(e);
        }else{
          this.users.push(user);
          resolve(true);
        }
      });
    });
  }
  /**
   * 用户离开房间
   * @param {Client} user 
   */
  leave(user) {
    return new Promise((resolve, reject) => {
      user.leave(this.id, e =>{
        if(e){
          reject(e);
        }else{
          this.users = this.users.filter( p => p.name !== user.name);
          resolve(true);
        }
      });
    });
  }
}