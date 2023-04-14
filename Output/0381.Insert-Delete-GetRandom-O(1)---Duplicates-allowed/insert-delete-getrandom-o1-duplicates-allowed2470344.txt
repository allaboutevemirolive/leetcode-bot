// https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/solutions/2470344/rust-solution-using-hashmap-binaryheap/
use rand::Rng;
use rand::thread_rng;
use std::collections::BinaryHeap;
use std::collections::HashMap;

struct RandomizedCollection {
    data: Vec<i32>,
    mp: HashMap<i32, BinaryHeap<usize>>
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl RandomizedCollection {

    fn new() -> Self {
        Self { data: vec![], mp: HashMap::new() }
    }
    
    fn insert(&mut self, val: i32) -> bool {
        let ret = if self.mp.contains_key(&val) { false } else { true };
        
        self.mp.entry(val).or_insert(BinaryHeap::new()).push(self.data.len());
        self.data.push(val);
        
        ret
    }
    
    fn remove(&mut self, val: i32) -> bool {
        if self.mp.contains_key(&val) == false { return false }
        
        let v = self.mp.get_mut(&val).unwrap();
        let i = v.pop().unwrap();
        if v.is_empty() { self.mp.remove(&val); }
        
        let n = self.data.len();
        if i < n - 1 {
            let w = self.mp.get_mut(&self.data[n - 1]).unwrap();
            self.data[i] = self.data[n - 1];
            w.pop();
            w.push(i);
        }
        
        self.data.pop();
        
        true
    }
    
    fn get_random(&self) -> i32 {
        self.data[thread_rng().gen_range(0, self.data.len())]
    }
}