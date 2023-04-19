// https://leetcode.com/problems/sliding-window-maximum/solutions/2260695/rust-simple-solution-using-heap-and-scan/
impl Solution {
  pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
    use std::collections::{BinaryHeap};

    let k = k as usize;
    nums
        .into_iter()
        .enumerate()
        .scan(BinaryHeap::with_capacity(k), |heap, (i, num)| {     
          let max = loop {
            if let Some(&(value, index)) = heap.peek() {
              if index + k <= i {
                heap.pop();
                continue;
              }
              break if value < num { num } else { value };
            } else {
              break num;
            }
          };
          heap.push((num, i));
          Some(max)
        })
        .skip(k - 1)
        .collect() 
  }
}