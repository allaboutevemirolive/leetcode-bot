// https://leetcode.com/problems/sliding-puzzle/solutions/873598/rust-translated-0ms-100/
impl Solution {
    pub fn sliding_puzzle(board: Vec<Vec<i32>>) -> i32 {
        use std::collections::{HashSet, VecDeque};

        let move_to = vec![
            vec![1, 3],
            vec![0, 2, 4],
            vec![1, 5],
            vec![0, 4],
            vec![1, 3, 5],
            vec![2, 4],
        ];

        let target = vec![1, 2, 3, 4, 5, 0];
        let start: Vec<i32> = board.concat();
        let mut visisted = HashSet::<Vec<i32>>::new();
        let mut queue = VecDeque::new();
        visisted.insert(start.clone());
        queue.push_back(start);
        let mut ans = 0;
        while !queue.is_empty() {
            let size = queue.len();
            for _ in 0..size {
                let cur = queue.pop_front().unwrap();
                if cur == target {
                    return ans;
                }
                let zero = cur.iter().position(|&x| x == 0).unwrap();
                for &x in &move_to[zero] {
                    let mut next = cur.to_vec();
                    next.swap(x, zero);
                    if visisted.contains(&next) {
                        continue;
                    } else {
                        visisted.insert(next.clone());
                        queue.push_back(next);
                    }
                }
            }
            ans += 1;
        }
        -1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sliding_puzzle() {
        assert_eq!(
            Solution::sliding_puzzle(vec![vec![1, 2, 3], vec![4, 0, 5]]),
            1
        );
    }

    #[test]
    fn test_sliding_puzzle_02() {
        assert_eq!(
            Solution::sliding_puzzle(vec![vec![1, 2, 3], vec![5, 4, 0]]),
            -1
        );
    }

    #[test]
    fn test_sliding_puzzle_03() {
        assert_eq!(
            Solution::sliding_puzzle(vec![vec![4, 1, 2], vec![5, 0, 3]]),
            5
        );
    }

    #[test]
    fn test_sliding_puzzle_04() {
        assert_eq!(
            Solution::sliding_puzzle(vec![vec![3, 2, 4], vec![1, 5, 0]]),
            14
        );
    }
}