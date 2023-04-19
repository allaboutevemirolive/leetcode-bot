// https://leetcode.com/problems/n-queens/solutions/946326/rust-solution/
use std::collections::HashSet;
impl Solution {
    pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
        Board::new(n as usize).solve()
    }
}

struct Board {
    matrix: Vec<Vec<char>>,
    n: usize,
    solutions: HashSet<Vec<String>>,
}

impl Board {
    pub fn new(n: usize) -> Self {
        Self {
            matrix: vec![vec!['.'; n]; n],
            n,
            solutions: HashSet::new(),
        }
    }
    pub fn solve(mut self) -> Vec<Vec<String>> {
        self._solve(0, 0);
        self.solutions.into_iter().collect()
    }
    fn _solve(&mut self, i: usize, count: usize) {
        if count == self.n {
            self.add_solution();
        } else if i == self.n {
        } else {
            for col in 0..self.n {
                if self.safe(i, col) {
                    self.matrix[i][col] = 'Q';
                    self._solve(i + 1, count + 1);
                    self.matrix[i][col] = '.';
                }
            }
        }
    }
    fn add_solution(&mut self) {
        self.solutions.insert(
            self.matrix
                .iter()
                .map(|x| x.iter().map(|x| *x).collect())
                .collect(),
        );
    }

    fn safe(&self, i: usize, j: usize) -> bool {
        for j_ in 0..self.n {
            if self.matrix[i][j_] == 'Q' {
                return false;
            }
        }
        for i_ in 0..self.n {
            if self.matrix[i_][j] == 'Q' {
                return false;
            }
        }
        let (mut i_, mut j_) = (i + 1, j + 1);
        while i_ > 0 && j_ > 0 {
            i_ -= 1;
            j_ -= 1;
            if self.matrix[i_][j_] == 'Q' {
                return false;
            }
        }
        let (mut i_, mut j_) = (i, j + 1);
        while i_ < self.n && j_ > 0 {
            j_ -= 1;
            if self.matrix[i_][j_] == 'Q' {
                return false;
            }
            i_ += 1;
        }
        let (mut i_, mut j_) = (i, j);
        while i_ < self.n && j_ < self.n {
            if self.matrix[i_][j_] == 'Q' {
                return false;
            }
            i_ += 1;
            j_ += 1;
        }
        let (mut i_, mut j_) = (i + 1, j);
        while i_ > 0 && j_ < self.n {
            i_ -= 1;
            if self.matrix[i_][j_] == 'Q' {
                return false;
            }
            j_ += 1;
        }
        true
    }
}