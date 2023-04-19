// https://leetcode.com/problems/sliding-window-maximum/solutions/694094/rust-vecdeque-simple/
use std::collections::VecDeque;

impl Solution {
  pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
    let mut result = vec![];
    let mut deque: VecDeque<i32> = VecDeque::new();
    for i in 0..nums.len() as i32 {
        if i >= k && *deque.front().unwrap() <= i - k {
          deque.pop_front();
        }

        Solution::trim_back(&mut deque, &nums, i);
        deque.push_back(i);

        if i >= k - 1 {
          result.push(nums[*deque.front().unwrap() as usize])
        }
    }
    result
  }

  fn trim_back(deque: &mut VecDeque<i32>, nums: &Vec<i32>, i: i32) {
      if let Some(idx) = deque.back() {
          if nums[*idx as usize] <= nums[i as usize] {
              deque.pop_back();
              Solution::trim_back(deque, nums, i);
          }
      }
  }
}