// https://leetcode.com/problems/frog-jump/solutions/2883803/rust-priority-queue/
use std::collections::BinaryHeap;
use std::collections::HashMap;
use std::collections::HashSet;

impl Solution {
    pub fn can_cross(stones: Vec<i32>) -> bool {
        if stones[1] != 1 { return false }
        
        let n = stones.len();
        let mut pq = BinaryHeap::from([(1usize, 1usize)]);
        let mut mp = HashMap::new();
        let mut s = HashSet::new();
        
        for i in 0 .. n  { mp.insert(stones[i] as usize, i); }
        
        while let Some((i, k)) = pq.pop() {
            if i == n - 1 { return true }
            
            if k > 1 && mp.contains_key(&(k + stones[i] as usize - 1)) {
                let j = *mp.get(&(k + stones[i] as usize - 1)).unwrap();
                if s.contains(&(j, k - 1)) == false {
                    pq.push((j, k - 1));
                    s.insert((j, k - 1));
                }
            }
            
            if mp.contains_key(&(k + stones[i] as usize)) {
                let j = *mp.get(&(k + stones[i] as usize)).unwrap();
                if s.contains(&(j, k)) == false {
                    pq.push((j, k));
                    s.insert((j, k));
                } 
            }
            
            if mp.contains_key(&(k + stones[i] as usize + 1)) {
                let j = *mp.get(&(k + stones[i] as usize + 1)).unwrap();
                if s.contains(&(j, k + 1)) == false {
                    pq.push((j, k + 1));
                    s.insert((j, k + 1));
                }
            }
        }
        
        false
    }
}