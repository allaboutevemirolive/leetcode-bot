// https://leetcode.com/problems/sliding-window-maximum/solutions/1455296/rust-using-a-monotonically-decreasing-queue-with-comments/
use std::collections::VecDeque;

impl Solution {
    pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
        let mut result = Vec::with_capacity(nums.len() - k as usize + 1);
		
		// We'll store the index of the number in the queue. We'll build a monotonically decreasing queue
        let mut queue = VecDeque::with_capacity((k * 2) as usize);

        for idx in 0..nums.len() {
            // remove old values 
			// if the stored idx at the front (corresponding to the largest number) is not in 
			// the current window, then we have to remove it from the queue
            while let Some(&pos) = queue.front() {
                if pos + k as usize > idx {
                    break; // the biggest number is within the current window
                }

                queue.pop_front(); // remove number from a previous window
            }

            // remove all values smaller than the current one
			// By doing this we'll maintain our queue in a monotonically decreasing order
            while let Some(&pos) = queue.back() { 
                let old = nums[pos]; // as we store indexes, we have to get the actual old value
                if old > nums[idx] {
                    break; // there are no more smaller values
                }

                queue.pop_back();  // remove smaller or equal number
            }

            queue.push_back(idx);

            // the window's maximum is at the front of the queue, because it's *decreasing*
            if idx + 1 >= k as usize { // push a result only if we have processed at least one full window
                if let Some(&max) = queue.front() { // always true, because of the `push_back()` above
                    result.push(nums[max]);
                }
            }
        }

        result
    }
}