// https://leetcode.com/problems/smallest-rotation-with-highest-score/solutions/1996118/rust-solution-using-binaryheap/
use std::cmp::*;
use std::collections::*;
impl Solution {
  pub fn best_rotation(nums: Vec<i32>) -> i32 {
    let n = nums.len();
    let mut max = 0;
    let mut result = 0;

    let mut heap = BinaryHeap::new();
    let mut count = 0;
    for i in 0..n {
      let ii = i as i32;
      let v = nums[i];

      if v <= ii {
        count += 1;
      } else {
        heap.push((Reverse(v-ii), v));
      }
    }

    max = count;
    for i in 1..n {
      let ii = i as i32;
      let k = n - i;
      let v = nums[k];

      count -= 1;
      heap.push((Reverse(v+ii), v));    
      while let Some((Reverse(min), v)) = heap.pop() {
        if min - ii <= 0 {
          count += 1;
        } else {
          heap.push((Reverse(min), v));
          break
        }
      }
      
      if max < count {
        result = k;
        max = count;
      } else if max == count {
        result = std::cmp::min(result, k);
      }
    }

    result as i32
  }
}