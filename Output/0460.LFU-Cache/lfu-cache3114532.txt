// https://leetcode.com/problems/lfu-cache/solutions/3114532/rust-solution-using-hashmap-btreemap/
use std::collections::BTreeMap;
use std::collections::HashMap;

struct LFUCache {
    capacity: usize,
    seq: usize,
    keys: HashMap<i32, (usize, usize)>, // key => (freq, seq)
    data: BTreeMap<(usize, usize), (i32, i32)> // (freq, seq) => (key, val)
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl LFUCache {

    fn new(capacity: i32) -> Self {
        Self { capacity: capacity as usize, seq: 0, keys: HashMap::new(), data: BTreeMap::new() }
    }
    
    fn get(&mut self, key: i32) -> i32 {
        if self.capacity == 0 || self.keys.contains_key(&key) == false { return -1 }
        
        let p = self.keys.remove(&key).unwrap();
        let value = self.data.remove(&p).unwrap().1;
        
        self.seq += 1;
        self.keys.insert(key, (p.0 + 1, self.seq));
        self.data.insert((p.0 + 1, self.seq), (key, value)); 
        
        value
    }
    
    fn put(&mut self, key: i32, value: i32) {
        if self.capacity == 0 { return }

        if self.keys.len() == self.capacity && self.keys.contains_key(&key) == false {
            let p = *self.data.keys().next().unwrap();
            
            let old_key = self.data.remove(&p).unwrap().0;
            self.keys.remove(&old_key);
        }

        let mut freq = 1;
        if let Some(p) = self.keys.remove(&key) {
            self.data.remove(&p);
            freq += p.0;
        }
        
        self.seq += 1;
        self.keys.insert(key, (freq, self.seq));
        self.data.insert((freq, self.seq), (key, value)); 
    }
}

/**
 * Your LFUCache object will be instantiated and called as such:
 * let obj = LFUCache::new(capacity);
 * let ret_1: i32 = obj.get(key);
 * obj.put(key, value);
 */