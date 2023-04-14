// https://leetcode.com/problems/making-a-large-island/solutions/402083/rust-solution-using-floodfill-algorithm-0-ms/
use std::fmt::{Debug, Error, Formatter};
use std::ops::{Index, IndexMut};

struct Matrix {
    columns: usize,
    rows: usize,
    buffer: Box<[u32]>,
}

impl Matrix {
    fn new(vecs: Vec<Vec<i32>>) -> Self {
        let columns = vecs[0].len();
        let rows = vecs.len();
        let mut res = Self {
            columns,
            rows,
            buffer: vec![0; columns * rows].into_boxed_slice(),
        };
        for (i, v) in vecs.into_iter().enumerate() {
            for (j, c) in v.into_iter().enumerate() {
                if c != 0 {
                    res[(i, j)] = 1;
                }
            }
        }
        res
    }
}

impl Index<(usize, usize)> for Matrix {
    type Output = u32;

    fn index(&self, index: (usize, usize)) -> &Self::Output {
        &self.buffer[self.columns * index.0 + index.1]
    }
}

impl IndexMut<(usize, usize)> for Matrix {
    fn index_mut(&mut self, index: (usize, usize)) -> &mut Self::Output {
        &mut self.buffer[self.columns * index.0 + index.1]
    }
}

impl Debug for Matrix {
    fn fmt(&self, f: &mut Formatter) -> Result<(), Error> {
        for row in 0..self.rows {
            let s: String = (&self.buffer[row * self.columns..(row + 1) * self.columns])
                .iter()
                .map(|&x| format!("{:1x}", x))
                .collect();
            f.write_fmt(format_args!("\n{}", s))?;
        }
        Ok(())
    }
}

fn fill_stack(matrix: &mut Matrix, start_point: (usize, usize), base_color: u32, new_color: u32) {
    if matrix[start_point] != base_color {
        return;
    }
    let mut stack: Vec<(usize, usize)> = Vec::with_capacity(32);
    stack.push(start_point);
    while let Some(current) = stack.pop() {
        if matrix[current] != base_color {
            continue;
        }

        matrix[current] = new_color;
        if current.1 > 0 && matrix[(current.0, current.1 - 1)] == base_color {
            stack.push((current.0, current.1 - 1));
        }
        if current.1 + 1 < matrix.columns && matrix[(current.0, current.1 + 1)] == base_color {
            stack.push((current.0, current.1 + 1));
        }
        if current.0 > 0 && matrix[(current.0 - 1, current.1)] == base_color {
            stack.push((current.0 - 1, current.1));
        }
        if current.0 + 1 < matrix.rows && matrix[(current.0 + 1, current.1)] == base_color {
            stack.push((current.0 + 1, current.1));
        }
    }
}

struct PossibleNeighborIslands {
    real_size: u32,
    buff: [u32; 4],
}

impl PossibleNeighborIslands {
    fn produce_from_empty(matrix: &Matrix, pos: (usize, usize)) -> PossibleNeighborIslands {
        let mut real_size: usize = 0;
        let mut buff = [0; 4];
        if pos.0 > 0
            && matrix[(pos.0 - 1, pos.1)] != 0
            && !buff.contains(&matrix[(pos.0 - 1, pos.1)])
        {
            buff[real_size] = matrix[(pos.0 - 1, pos.1)];
            real_size += 1;
        }
        if pos.0 + 1 < matrix.rows
            && matrix[(pos.0 + 1, pos.1)] != 0
            && !buff.contains(&matrix[(pos.0 + 1, pos.1)])
        {
            buff[real_size] = matrix[(pos.0 + 1, pos.1)];
            real_size += 1;
        }
        if pos.1 > 0
            && matrix[(pos.0, pos.1 - 1)] != 0
            && !buff.contains(&matrix[(pos.0, pos.1 - 1)])
        {
            buff[real_size] = matrix[(pos.0, pos.1 - 1)];
            real_size += 1;
        }
        if pos.1 + 1 < matrix.columns
            && matrix[(pos.0, pos.1 + 1)] != 0
            && !buff.contains(&matrix[(pos.0, pos.1 + 1)])
        {
            buff[real_size] = matrix[(pos.0, pos.1 + 1)];
            real_size += 1;
        }
        PossibleNeighborIslands {
            real_size: real_size as u32,
            buff,
        }
    }

    fn get_neighbours(&self) -> &[u32] {
        &self.buff[..self.real_size as usize]
    }
}

fn get_max_connected_island(matrix: &Matrix, max_color: u32) -> usize {
    // color to size
    let mut areas: Vec<usize> = vec![0; max_color as usize];

    for i in 0..matrix.rows {
        for j in 0..matrix.columns {
            let color = matrix[(i, j)];
            if color != 0 {
                areas[color as usize - 1] += 1;
            }
        }
    }

    let mut maximum = areas.iter().cloned().max().unwrap_or(0) + 1;
    if maximum > matrix.columns * matrix.rows {
        return matrix.columns * matrix.rows;
    }
    for i in 0..matrix.rows {
        for j in 0..matrix.columns {
            let color = matrix[(i, j)];
            if color == 0 {
                let neighbours = PossibleNeighborIslands::produce_from_empty(&matrix, (i, j));
                if neighbours.real_size == 0 {
                    continue;
                }
                let total_size: usize = neighbours
                    .get_neighbours()
                    .iter()
                    .map(|&x| areas[x as usize - 1])
                    .sum();
                maximum = std::cmp::max(total_size + 1, maximum);
            }
        }
    }
    maximum
}

fn work(grid: Vec<Vec<i32>>) -> i32 {
    if grid.is_empty() || grid[0].is_empty() {
        return 0;
    }
    let mut matrix = Matrix::new(grid);
    let mut current_color = 2u32;
    for i in 0..matrix.rows {
        for j in 0..matrix.columns {
            if matrix[(i, j)] == 1 {
                fill_stack(&mut matrix, (i, j), 1, current_color);
                current_color += 1;
            }
        }
    }

    if current_color == 2 {
        return 1;
    }

    for x in matrix.buffer.iter_mut() {
        if current_color - 1 == *x {
            *x = 1;
        }
    }

    //println!("Drawn!{:?}", &matrix);

    get_max_connected_island(&matrix, current_color - 2) as i32
}

impl Solution {
    pub fn largest_island(grid: Vec<Vec<i32>>) -> i32 {
        work(grid)
    }
}