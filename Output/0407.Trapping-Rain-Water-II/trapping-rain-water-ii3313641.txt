// https://leetcode.com/problems/trapping-rain-water-ii/solutions/3313641/rust-solution/
use std::{cmp::Ordering, collections::BinaryHeap};

impl Solution {
    const DIRS: [[i32; 2]; 4] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    pub fn trap_rain_water(mut heights: Vec<Vec<i32>>) -> i32 {
        #[derive(PartialEq, Eq)]
        struct Cell(usize, usize, i32);

        impl PartialOrd for Cell {
            fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
                Some(self.cmp(other))
            }
        }

        impl Ord for Cell {
            fn cmp(&self, other: &Self) -> Ordering {
                other.2.cmp(&self.2)
            }
        }

        let mut heap = BinaryHeap::new();
        let (r, c) = (heights.len() - 1, heights[0].len() - 1);
        let mut visited = vec![vec![false; c + 1]; r + 1];

        for y in 0..=r {
            heap.push(Cell(y, 0, heights[y][0]));
            heap.push(Cell(y, c, heights[y][c]));
            visited[y][0] = true;
            visited[y][c] = true;
        }

        for x in 0..=c {
            heap.push(Cell(0, x, heights[0][x]));
            heap.push(Cell(r, x, heights[r][x]));
            visited[0][x] = true;
            visited[r][x] = true;
        }

        let (r, c) = (r as i32, c as i32);
        let mut ans = 0;

        while let Some(v) = heap.pop() {
            for dir in Self::DIRS {
                let np = (v.0 as i32 + dir[0], v.1 as i32 + dir[1]);
                if np.0 >= 0 && np.0 <= r && np.1 >= 0 && np.1 <= c {
                    let pos = (np.0 as usize, np.1 as usize);
                    if visited[pos.0][pos.1] {
                        continue;
                    }
                    visited[pos.0][pos.1] = true;
                    if heights[v.0][v.1] > heights[pos.0][pos.1] {
                        ans += heights[v.0][v.1] - heights[pos.0][pos.1];
                        heights[pos.0][pos.1] = heights[v.0][v.1];
                    }
                    heap.push(Cell(pos.0, pos.1, heights[pos.0][pos.1]));
                }
            }
        }

        ans
    }
}
