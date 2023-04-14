// https://leetcode.com/problems/swim-in-rising-water/solutions/2575252/rust-just-a-dijkstra/
use std::cmp::Reverse;
use std::collections::BinaryHeap;

const DIR: [(isize, isize); 4] = [(-1, 0), (0, -1), (0, 1), (1, 0)];

pub fn swim_in_water(mut grid: Vec<Vec<i32>>) -> i32 {
    let mut pq = BinaryHeap::new();
    pq.push((Reverse(grid[0][0]), 0, 0));

    while let Some((Reverse(t), r, c)) = pq.pop() {
        // skip already visited
        if grid[r][c] < 0 {
            continue;
        }

        // mark as already visited
        grid[r][c] = -1;

        // Check if it's our target
        if r == grid.len() - 1 && c == grid[r].len() - 1 {
            return t;
        }

        for (dr, dc) in DIR {
            let rx = r as isize + dr;
            let cx = c as isize + dc;

            // Check if it's within the grid
            if rx < 0 || cx < 0 {
                continue;
            }

            let rx = rx as usize;
            let cx = cx as usize;

            // Check if it's within the grid
            if rx >= grid.len() || cx >= grid[rx].len() {
                continue;
            }

            // Check if already visited
            if grid[rx][cx] < 0 {
                continue;
            }

            // push the bigger of T and the grid's cell value
            pq.push((Reverse(t.max(grid[rx][cx])), rx, cx));
        }
    }

    // there is always a path
    unreachable!()
}