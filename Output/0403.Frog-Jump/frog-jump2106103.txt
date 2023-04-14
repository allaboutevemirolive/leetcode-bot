// https://leetcode.com/problems/frog-jump/solutions/2106103/rust-solution-using-01-bfs/
use std::collections::*;

impl Solution {
  pub fn can_cross(stones: Vec<i32>) -> bool {
    let goal = stones[stones.len()-1] as usize;

    let mut set = HashSet::new();
    for i in stones {
      set.insert(i as usize);
    }

    if goal == 1 {
      return true
    }

    if !set.contains(&1) {
      return false
    }

    let mut que = VecDeque::new();
    let mut seen = HashSet::new();
    que.push_back((1,1));
    
    while let Some((ci, speed)) = que.pop_front() {
      if ci == goal { return true }
      if seen.contains(&(ci, speed)) { continue }
      seen.insert((ci, speed));

      for i in 1.. {
        let ni = speed * i + ci;
        if !set.contains(&ni) || seen.contains(&(ni, speed)) { break }
        que.push_back((ni, speed));
      }
      
      let ps = speed + 1;
      let ni = ci+ps;
      if set.contains(&ni) {
        que.push_front((ni, ps));
      }

      let ms = speed - 1;
      let ni = ci+ms;
      if 0 < ms && set.contains(&ni) {
        que.push_front((ni, ms));
      }
    }
    false
  }
}