// https://leetcode.com/problems/trapping-rain-water-ii/solutions/2741943/go-java-rust-heap-solution-54ms/
use std::cmp::{max, Ordering};
use std::collections::BinaryHeap;

#[derive(PartialEq, Eq)]
struct Cell {
    row: usize,
    col: usize,
    height: i32,
}

impl PartialOrd<Self> for Cell {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Cell {
    fn cmp(&self, other: &Self) -> Ordering {
        other.height.cmp(&self.height)
    }
}

impl Solution {
    pub fn trap_rain_water(heights: Vec<Vec<i32>>) -> i32 {
        let m = heights.len();
        let n = heights[0].len();
        let mut visited = vec![vec![false; n]; m];
        let mut heap = BinaryHeap::new();
        for (i, vec) in heights.iter().enumerate() {
            heap.push(Cell { row: i, col: n - 1, height: vec[n - 1] });
            heap.push(Cell { row: i, col: 0, height: vec[0] });
        }
        for i in 0..n {
            heap.push(Cell { row: 0, col: i, height: heights[0][i] });
            heap.push(Cell { row: m - 1, col: i, height: heights[m - 1][i] });
        }
        let dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        let mut res = 0;
        while let Some(cell) = heap.pop() {
            visited[cell.row][cell.col] = true;
            for dir in dirs {
                let x = cell.row as i32 + dir[0];
                let y = cell.col as i32 + dir[1];
                if x < 0 || y < 0 {
                    continue;
                }
                let x = x as usize;
                let y = y as usize;
                if x >= m || y >= n || visited[x][y] {
                    continue;
                }
                visited[x][y] = true;
                res += max(cell.height - heights[x][y], 0);
                heap.push(Cell { row: x, col: y, height: max(heights[x][y], cell.height) });
            }
        }
        res
    }
}