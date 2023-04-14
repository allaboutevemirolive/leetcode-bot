// https://leetcode.com/problems/trapping-rain-water-ii/solutions/2592725/rust-pq-clean-code-with-comments/
use std::cmp::Reverse;
use std::collections::BinaryHeap;

const DIR: [(isize, isize); 4] = [(-1, 0), (0, -1), (0, 1), (1, 0)];

pub fn trap_rain_water(mut height_map: Vec<Vec<i32>>) -> i32 {
    assert!(height_map.len() > 0);
    let rows = height_map.len();
    let cols = height_map[0].len();

    // Fast path: If we have less than a 3x3 grid, then
    // every cell touches the boundary, thus it cannot
    // trap any water
    if rows < 3 || cols < 3 {
        return 0;
    }

    let mut grid = vec![vec![-1; cols]; rows];
    let mut pq = BinaryHeap::new();

    // Add the boundaries of the rectangle to the PQ. We mark the cell as
    // "pushed" by making its "height" negative (i.e. the problem statement
    // allows only positive heights). Thus if we reach a cell with a
    // negative height we can skip pushing it to the PQ, because it has
    // already been pushed, waiting to be processed
    for c in 0..cols {
        pq.push((Reverse(height_map[0][c]), 0, c));
        height_map[0][c] = -height_map[0][c];

        if rows > 1 {
            pq.push((Reverse(height_map[rows - 1][c]), rows - 1, c));
            height_map[rows - 1][c] = -height_map[rows - 1][c];
        }
    }
    for r in 1..rows - 1 {
        pq.push((Reverse(height_map[r][0]), r, 0));
        height_map[r][0] = -height_map[r][0];

        if cols > 1 {
            pq.push((Reverse(height_map[r][cols - 1]), r, cols - 1));
            height_map[r][cols - 1] = -height_map[r][cols - 1];
        }
    }

    while let Some((Reverse(h), r, c)) = pq.pop() {
        let mut min_h = i32::MAX;
        for (dr, dc) in DIR {
            let rx = r as isize + dr;
            let cx = c as isize + dc;
            if rx < 0 || cx < 0 {
                // A cell that's on the boundary cannot trap
                // any water, because it will fall of the boundary
                min_h = 0;
                continue;
            }

            let rx = rx as usize;
            let cx = cx as usize;
            if rx >= rows || cx >= cols {
                // A cell that's on the boundary cannot trap
                // any water, because it will fall of the boundary
                min_h = 0;
                continue;
            }

            // If the neighbour has been processed, take into
            // account its height
            if grid[rx][cx] >= 0 {
                min_h = min_h.min(grid[rx][cx]);
                continue;
            }

            // If the neighbouring cell has not been processed yet, then
            // check if it has been pushed to the queue. If not - push it,
            // otherwise ignore it.
            if height_map[rx][cx] >= 0 {
                pq.push((Reverse(height_map[rx][cx]), rx, cx));
                // mark as pushed, by making its height negative
                height_map[rx][cx] = -height_map[rx][cx];
            }
        }

        min_h = min_h.max(h);
        grid[r][c] = min_h;
    }


    let mut volume = 0;
    for r in 0..rows {
        for c in 0..cols {
            // After we have processed all cells from `height_map`
            // all of its values should be negative, thus we have
            // to add them to the corresponding `grid` values
            // instead of subtracting them
            volume += grid[r][c] + height_map[r][c];
        }
    }

    volume
}