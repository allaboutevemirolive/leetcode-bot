// https://leetcode.com/problems/sliding-window-maximum/solutions/235126/rust-solution/
use std::i32;
use std::collections::VecDeque;

impl Solution {

    pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {

        let len = nums.len() as i32;

        let mut u_q_i: VecDeque<usize> = VecDeque::new();

        let mut window_maxes  = Vec::new();
        if nums.len() == 0 {
            return window_maxes;
        }

        //initialize to k
        for i in 0..k {
            while u_q_i.len() > 0 && nums[i as usize] >= nums[*u_q_i.back().unwrap()] {
                u_q_i.pop_back(); // useless because it's
            }
            u_q_i.push_back(i as usize);
        }

        for i in k..len {
            window_maxes.push(nums[u_q_i[0]]);

            while u_q_i.len() > 0 && u_q_i[0] <= (i-k) as usize {
                u_q_i.pop_front();
            }

            while u_q_i.len() > 0 && nums[i as usize] >= nums[*u_q_i.back().unwrap()] {
                u_q_i.pop_back();
            }

            u_q_i.push_back(i as usize);
        }
        window_maxes.push(nums[u_q_i[0]]);

        window_maxes
    }
}