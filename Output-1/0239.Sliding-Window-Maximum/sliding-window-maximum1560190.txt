// https://leetcode.com/problems/sliding-window-maximum/solutions/1560190/rust-o-n-primitive-array-wins-vs-hash-map-faster-than-100/
impl Solution {
    pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
        let     k    = k as usize;
        let mut set  = MultiSet::new(&nums[0..k]);
        let mut vals = vec![set.max()];
        
        for i in 0..nums.len() - k {
            set.insert(nums[i + k]);  // Order important. Insert before remove.
            set.remove(nums[i]);
            vals.push(set.max());
        }
        vals
    }
}
const MAP_SIZE: usize = 20_001;
const KEY_BASE: usize = 10_000;

struct MultiSet {
    map : [i32; MAP_SIZE],
    max : usize,
}
impl MultiSet {
    fn new(init: &[i32]) -> Self {
        let mut map = [0; MAP_SIZE];
        let mut max = 0;        
        for n in init.iter().map(|&n| n as usize + KEY_BASE) {
            map[n] += 1;
            max = max.max(n);
        }
        Self { map, max }
    }
    fn max(&self) -> i32 {
        (self.max - KEY_BASE) as i32
    }
    fn remove(&mut self, key: i32) {
        let key = key as usize + KEY_BASE;
        self.map[key] -= 1;
        while self.map[self.max] == 0 {
            self.max -= 1;
        }
    }
    fn insert(&mut self, key: i32) {
        let key = key as usize + KEY_BASE;
        self.max = self.max.max(key);
        self.map[key] += 1;
    }
}