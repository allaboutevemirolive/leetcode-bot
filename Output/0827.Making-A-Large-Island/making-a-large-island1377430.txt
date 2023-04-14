// https://leetcode.com/problems/making-a-large-island/solutions/1377430/making-a-large-island-rust/
use std::collections::HashMap;
use std::iter::repeat;

impl Solution {
    pub fn largest_island(matrix: Matrix<i32>) -> i32 {
        LargestIslandSolver::new(matrix).solve() as i32
    }
}

struct LargestIslandSolver {
    non_component_indices: Vec<Position>,
    component_indices: Matrix<usize>,
    matrix: Matrix<i32>,
    visited: Matrix<bool>,
    n: usize,
    component_index: usize,
    component_sizes: HashMap<usize, usize>,
}
type Position = (i32, i32);
type Matrix<T> = Vec<Vec<T>>;

impl LargestIslandSolver {
    const NEIGHBOURS: [Position; 4] = [(-1, 0), (0, 1), (1, 0), (0, -1)];

    fn new(matrix: Matrix<i32>) -> Self {
        let n = matrix.len();
        Self {
            matrix,
            visited: vec![vec![false; n]; n],
            n,
            component_indices: vec![vec![0; n]; n],
            component_index: 1,
            non_component_indices: vec![],
            component_sizes: HashMap::new(),
        }
    }

    fn solve(mut self) -> usize {
        self.calculate_component_sizes();
        self.non_component_indices.iter()
            .map(|&position| self.calculate_component_size_with_flip(position))
            .max()
            .unwrap_or(self.component_sizes.values().cloned().max().unwrap_or(0))
    }

    fn calculate_component_sizes(&mut self) {
        (0..self.n as i32).for_each(move |x|
            (0..self.n as i32).zip(repeat(x)).for_each(|position|
                self.handle_position(position)));
    }
    
    fn calculate_component_size_with_flip(&self, (i, j): Position) -> usize {
        let mut sum = 1;
        let mut used_components = vec![];

        for position in Self::NEIGHBOURS.iter().map(|(m, n)| (i + m, j + n)) {
            if self.is_safe(position) {
                let component_index = self.component_index(position);
                if self.is_island(position) && !used_components.contains(&component_index) {
                    sum += self.component_sizes.get(&component_index).unwrap_or(&0usize);
                    used_components.push(component_index);
                }
            }
        }
        sum
    }
    fn calculate_component_size(&mut self, position: Position) -> usize {
        let mut stack = vec![position];
        self.set_component_index(position);
        self.set_visited(position);

        let mut size = 0;
        while let Some((i, j)) = stack.pop() {
            size += 1;

            for position in Self::NEIGHBOURS.iter().map(|(m, n)| (i + m, j + n)) {
                if self.is_safe(position) && self.is_component(position) {
                    self.set_component_index(position);
                    self.set_visited(position);
                    stack.push(position);
                }
            }
        }
        size
    }

    fn handle_position(&mut self, position: Position) {
        match self.is_component(position) {
            true => self.handle_component(position),
            false => self.handle_non_component(position),
        }
    }
    fn handle_component(&mut self, position: Position) {
        self.set_component_size(position);
        self.component_index += 1;
    }
    fn handle_non_component(&mut self, position: Position) {
        if !self.is_visited(position) {
            self.non_component_indices.push(position);
        }
    }

    fn is_component(&self, position: Position) -> bool {
        !self.is_visited(position) && self.is_island(position)
    }
    fn is_safe(&self, (x, y): Position) -> bool {
        0 <= x && x < self.n as i32 && 0 <= y && y < self.n as i32
    }

    fn is_island(&self, (x, y): Position) -> bool {
        self.matrix[x as usize][y as usize] == 1
    }
    fn is_visited(&self, (x, y): Position) -> bool {
        self.visited[x as usize][y as usize]
    }

    fn component_index(&self, (x, y): Position) -> usize {
        self.component_indices[x as usize][y as usize]
    }

    fn set_visited(&mut self, (x, y): Position) {
        self.visited[x as usize][y as usize] = true;
    }
    fn set_component_index(&mut self, (x, y): Position) {
        self.component_indices[x as usize][y as usize] = self.component_index;
    }
    fn set_component_size(&mut self, position: Position) {
        *self.component_sizes.entry(self.component_index).or_insert(0)
            += self.calculate_component_size(position);
    }
}