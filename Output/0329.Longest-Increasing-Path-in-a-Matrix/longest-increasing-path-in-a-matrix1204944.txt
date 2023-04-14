// https://leetcode.com/problems/longest-increasing-path-in-a-matrix/solutions/1204944/rust-readable-solution-recursion-cache/
use Direction::*;

type Point = (usize, usize);

enum Direction {
    Left,
    Right,
    Up,
    Down,
}

pub struct Solution;

impl Solution {
    pub fn longest_increasing_path(matrix: Vec<Vec<i32>>) -> i32 {
        assert!(!matrix.is_empty() && !matrix[0].is_empty());

        let mut memo = vec![vec![0; matrix[0].len()]; matrix.len()];
        let mut max = 0;
        for (y, xs) in matrix.iter().enumerate() {
            for x in 0..xs.len() {
                let longest = longest_path(&matrix, &mut memo, (x, y));
                if longest > max {
                    max = longest;
                }
            }
        }
        return max;

        fn longest_path(matrix: &Vec<Vec<i32>>, memo: &mut Vec<Vec<i32>>, (x, y): Point) -> i32 {
            if memo[y][x] != 0 {
                memo[y][x]
            } else {
                let try_move = |direction: &Direction| {
                    let new_point = match direction {
                        Left => x.checked_sub(1).map(|new_x| (new_x, y)),
                        Right => {
                            let new_x = x + 1;
                            matrix[y].get(new_x).map(|_| (new_x, y))
                        }
                        Up => {
                            let new_y = y + 1;
                            matrix.get(new_y).map(|_| (x, new_y))
                        }
                        Down => y.checked_sub(1).map(|new_y| (x, new_y)),
                    };
                    new_point.filter(|(new_x, new_y)| matrix[*new_y][*new_x] > matrix[y][x])
                };

                let next_longest_if_any = [Left, Right, Up, Down]
                    .iter()
                    .filter_map(try_move)
                    .map(|point| longest_path(matrix, memo, point))
                    .max()
                    .unwrap_or(0);
                let longest = 1 + next_longest_if_any;
                memo[y][x] = longest;
                longest
            }
        }
    }
}