// https://leetcode.com/problems/n-queens/solutions/2003962/rust-backtracking-with-analysis-and-explanation/
#[derive(Debug, Clone)]
pub struct Square {
    // Position on chess board
    row: u8,
    col: u8,
}

impl Square {
    pub fn new(row: u8, col: u8) -> Self {
        Self { row, col }
    }
	
    pub fn is_diagonal_with(&self, other: &Self) -> bool {
        (self.row as i16 - other.row as i16).abs() == (self.col as i16 - other.col as i16).abs()
    }

    pub fn is_same_row(&self, other: &Self) -> bool {
        self.row == other.row
    }

    pub fn is_same_column(&self, other: &Self) -> bool {
        self.col == other.col
    }

    pub fn is_attackable(&self, other: &Self) -> bool {
        self.is_same_column(other) || self.is_diagonal_with(other) || self.is_same_row(other)
    }

    pub fn column(&self) -> u8 {
        self.col
    }
}

fn square_is_attacked_by_previous(sq: &Square, tmp: &Vec<Square>) -> bool {
    for other in tmp {
        if sq.is_attackable(other) {
            return true;
        }
    }
    false
}

fn pretty_print(tmp: &Vec<Square>, n: i32) -> Vec<String> {
    let mold = vec![b'.'; n as usize];
    tmp.iter()
        .map(|sq| {
            let mut ss = mold.clone();
            ss[sq.column() as usize] = b'Q';
            unsafe { String::from_utf8_unchecked(ss) }
        })
        .collect()
}

fn backtrack(results: &mut Vec<Vec<String>>, start: usize, n: i32, tmp: &mut Vec<Square>) {
    if start == n as usize {
        results.push(pretty_print(tmp, n));
        return;
    }
    let row = start as u8;
    for col in 0..n as u8 {
        let sq = Square::new(row, col);

        // Check that square is not attacked by previous
        // takes O(n) time in the worst case
        if start == 0 || !square_is_attacked_by_previous(&sq, tmp) {
            // We add valid position to possible solution path
            tmp.push(sq);
            // Collect valid solutions having the same previous squares
            // no two queens can be in the same row - so we shift start every time
            backtrack(results, start + 1, n, tmp);
            // Then remove current square to check other possible solutions
            // by changing column
            tmp.pop();
        }
    }
}

pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
    let mut results = vec![];
    let mut tmp = Vec::with_capacity(n as usize);
    backtrack(&mut results, 0, n, &mut tmp);
    results
}