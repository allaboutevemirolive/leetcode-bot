// https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/solutions/3319622/rust-hashmap-and-vec-solution/
use std::collections::HashMap;
use rand::Rng;
struct RandomizedCollection {
  map:HashMap<i32,Vec<usize>>,
  list:Vec<i32>
}
impl RandomizedCollection {

  fn new() -> Self {
    Self{map:HashMap::new(),list:vec![]}
  }

  fn insert(&mut self, val: i32) -> bool {
    match self.map.get_mut(&val) {
      Some(v)=>v.push(self.list.len()),
      None=> {
        self.map.insert(val,vec![self.list.len()]);
      }
    };
    self.list.push(val);
    self.map.get(&val).unwrap().len()==1
  }

  fn remove(&mut self, val: i32) -> bool {
    if self.map.get(&val).is_none(){
      return false;
    }
    let removed_index = self.map.get_mut(&val).unwrap().pop().unwrap();
    if self.map.get(&val).unwrap().len()==0{
      self.map.remove(&val);
    }
    self.list[removed_index]=self.list[self.list.len()-1];
    if self.list.len()-1!=removed_index{
      let vec=self.map.get_mut(&self.list[self.list.len()-1]).unwrap();
      for (i,v) in vec.iter().enumerate() {
        if *v == self.list.len()-1{
          vec.remove(i);
          vec.push(removed_index);
          break;
        }
      }
    }
    self.list.pop();
    true
  }

  fn get_random(&self) -> i32 {
    let num = rand::thread_rng().gen_range(0,self.list.len());
    self.list[num]
  }
}