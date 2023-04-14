// https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/solutions/1539140/rust-map-vector-using-entry/
use std::collections::{HashMap, HashSet};
use rand::Rng;
#[derive(Default)]
struct RandomizedCollection {
    map: HashMap<i32, HashSet<usize>>,
    vec: Vec<i32>,
}

/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl RandomizedCollection {
    fn new() -> Self {
        Default::default()
    }
    
    fn insert(&mut self, val: i32) -> bool {
        let retval = !self.map.contains_key(&val);
        let ind = self.vec.len();
        self.vec.push(val);
        self.map.entry(val).or_default().insert(ind);
        retval
    }
    
    fn remove(&mut self, val: i32) -> bool {
        if !self.map.contains_key(&val) { return false }
    
        let len = self.vec.len();
        if self.vec[len-1] == val {
            self.map.entry(val).or_default().remove(&(len-1));
        } else {
            let ind = self.map.get(&val).unwrap().iter().next().cloned().unwrap();
            let last_entry = self.vec[len-1];
            self.map.entry(last_entry).and_modify(|e| {
                e.remove(&(len-1));
                e.insert(ind);
            });
            self.map.entry(val).or_default().remove(&ind);
            self.vec[ind] = last_entry;
        }
        self.vec.pop();
        if self.map.get(&val).unwrap().len() == 0 {
            self.map.remove(&val);
        }
        true
    }
    
    fn get_random(&self) -> i32 {
        let randint = rand::thread_rng().gen_range(0, self.vec.len());
        self.vec[randint]
    }
}