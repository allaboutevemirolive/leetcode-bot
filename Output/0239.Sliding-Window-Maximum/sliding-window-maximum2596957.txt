// https://leetcode.com/problems/sliding-window-maximum/solutions/2596957/rust-vecdeque-o-n-with-iter-scan/
pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
        nums.iter().enumerate().scan(VecDeque::new(), |q: &mut VecDeque<(i32, i32)>, (pos, &num)| {
            while !q.is_empty() && q.back().unwrap().1 <= num {
                q.pop_back();
            }
            q.push_back((pos as i32, num));
            if q.front().unwrap().0 + k <= pos as i32 {
                q.pop_front();
            }
            Some(q[0].1)
        }).skip(k as usize-1).collect::<Vec<_>>()
    }