// https://leetcode.com/problems/contain-virus/solutions/2515969/rust-dfs-all-the-way/

const DIRECTION: [(isize, isize); 4] = [(-1, 0), (0, -1), (0, 1), (1, 0)];

const HEALTHY: i32 = 0;
const INFECTED: i32 = 1;
const MARKED_HEALTHY: i32 = 2;
const MARKED_INFECTED: i32 = 3;
const WALLED: i32 = 4;

pub fn contain_virus(mut grid: Vec<Vec<i32>>) -> i32 {
    let mut total = 0;

    // Loop until we have stopped the infection or the whole world has become infected
    loop {
        let mut max_infected = 0;
        let mut border = 0;
        let mut rx = 0;
        let mut cx = 0;

        // Measure the border length and the newly_infected 
        // neighbours for each infection cluster
        for r in 0..grid.len() {
            for c in 0..grid[r].len() {
                if grid[r][c] == INFECTED {
                    let (infected, perimeter) = measure_border_and_infectiousness(&mut grid, r, c);
                    if infected > max_infected {
                        max_infected = infected;
                        border = perimeter;
                        rx = r;
                        cx = c;
                    }
                }
            }
        }

        // If there are no newly infected, then we can terminate and print the result
        if border == 0 {
            break;
        }

        total += border;

        // "WALL" the most infectious cluster
        mark_walled(&mut grid, rx, cx);

        // Expand the other infectious clusters
        for r in 0..grid.len() {
            for c in 0..grid[r].len() {
                if grid[r][c] == MARKED_INFECTED {
                    expand_infection(&mut grid, r, c);
                }
            }
        }
    }

    total
}

fn measure_border_and_infectiousness(grid: &mut [Vec<i32>], r: usize, c: usize) -> (i32, i32) {
    let mut newly_infected = 0;
    let mut border = 0;

    let mut marked = vec![];
    let mut stack = vec![(r, c)];
    grid[r][c] = MARKED_INFECTED;

    while let Some((r, c)) = stack.pop() {
        for (dr, dc) in DIRECTION {
            let rx = r as isize + dr;
            let cx = c as isize + dc;
            if rx < 0 || cx < 0 {
                continue;
            }

            let rx = rx as usize;
            let cx = cx as usize;
            if rx >= grid.len() || cx >= grid[rx].len() {
                continue;
            }

            if grid[rx][cx] == HEALTHY {
                border += 1;
                newly_infected += 1;

                // mark the newly infected cell in order to count it only once
                grid[rx][cx] = MARKED_HEALTHY;

                // remember its coordinates in order to "unmark it" at the end
                marked.push((rx, cx));
            } else if grid[rx][cx] == MARKED_HEALTHY {
                // already included in the newly infected, but it still 
                // contributes to the border length
                border += 1;
            } else if grid[rx][cx] == INFECTED {
                grid[rx][cx] = MARKED_INFECTED;
                stack.push((rx, cx));
            }
        }
    }

    // unmark the marked healthy cells
    for (rx, cx) in marked {
        grid[rx][cx] = HEALTHY;
    }

    (newly_infected, border)
}

fn mark_walled(grid: &mut [Vec<i32>], r: usize, c: usize) {
    let mut stack = vec![(r, c)];
    grid[r][c] = WALLED;

    while let Some((r, c)) = stack.pop() {
        for (dr, dc) in DIRECTION {
            let rx = r as isize + dr;
            let cx = c as isize + dc;
            if rx < 0 || cx < 0 {
                continue;
            }

            let rx = rx as usize;
            let cx = cx as usize;
            if rx >= grid.len() || cx >= grid[rx].len() {
                continue;
            }

            if grid[rx][cx] == MARKED_INFECTED {
                grid[rx][cx] = WALLED;
                stack.push((rx, cx));
            }
        }
    }
}

fn expand_infection(grid: &mut [Vec<i32>], r: usize, c: usize) {
    let mut stack = vec![(r, c)];
    grid[r][c] = INFECTED;

    while let Some((r, c)) = stack.pop() {
        for (dr, dc) in DIRECTION {
            let rx = r as isize + dr;
            let cx = c as isize + dc;
            if rx < 0 || cx < 0 {
                continue;
            }

            let rx = rx as usize;
            let cx = cx as usize;
            if rx >= grid.len() || cx >= grid[rx].len() {
                continue;
            }

            if grid[rx][cx] == HEALTHY {
                grid[rx][cx] = INFECTED;
            } else if grid[rx][cx] == MARKED_INFECTED {
                grid[rx][cx] = INFECTED;
                stack.push((rx, cx));
            }
        }
    }
}