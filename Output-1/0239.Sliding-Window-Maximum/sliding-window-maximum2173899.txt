// https://leetcode.com/problems/sliding-window-maximum/solutions/2173899/rust-solution-with-explanation-monotonic-deque-time-complexity-o-n-m/
pub struct Solution;

impl Solution {
 pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
  // Using Deque as Monotically decreasing queue (MDQ)
  let mut mono_q = std::collections::VecDeque::<i32>::new();
  let mut mono_q_index = std::collections::VecDeque::<usize>::new();
  let mut window_counter: i32 = 0; // Counter of the sliding window
  let mut ans = vec![]; // Vector of answers
  let mut cur_max = i32::MIN; // Current max number

  for i in 0..nums.len() {
   // Count the window up until window size reach k target
   if window_counter < k {
    window_counter += 1;
   }
   // If there is element in the monotic queue
   // => There will be two conditions happen
   while mono_q.len() > 0 {
    let tail = mono_q.back().unwrap();
    // CONDITION: Breaks the decreasing pattern
    // WHEN: the current number > queue tail
    if nums[i] > *tail {
     // DO: remove element from two queues
     mono_q.pop_back().unwrap();
     mono_q_index.pop_back().unwrap();
     continue;
    }
    let tail_index = mono_q_index.front().unwrap();
    // CONDITION: The number in mono_q is not contained in the window
    // WHEN: i - k == front element of mono_q_index
    if i as i32 - k == *tail_index as i32 {
     // DO: Remove index of outdated elements
     mono_q_index.pop_front().unwrap();
     mono_q.pop_front().unwrap();
    }
    break;
   }
   // Add element to two queues like usual
   mono_q.push_back(nums[i]);
   mono_q_index.push_back(i);
   if mono_q.len() > 0 {
    cur_max = *mono_q.front().unwrap();
   }
   cur_max = std::cmp::max(nums[i], cur_max);
   if window_counter == k {
    ans.push(cur_max);
   }
  }
  ans
 }
}