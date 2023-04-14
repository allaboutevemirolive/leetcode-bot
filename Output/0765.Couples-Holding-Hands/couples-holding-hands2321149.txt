// https://leetcode.com/problems/couples-holding-hands/solutions/2321149/rust-dfs/
impl Solution {
    pub fn min_swaps_couples(row: Vec<i32>) -> i32 {
        Self::dfs_helper(row.clone())
    }

    fn dfs_helper(row: Vec<i32>) -> i32 {
        let mut row = row;
        let n = row.len();
        if n <= 2 {
            return 0;
        }

        let index_n_1 = row.iter().position(|&x| (x as usize) == n - 1).unwrap();

        let neighbour = if index_n_1 % 2 != 0 {
            index_n_1 - 1
        } else {
            index_n_1 + 1
        };
        let mut result = 0;

        if (row[index_n_1] - row[neighbour]).abs() == 1 {
            // do not need swap
        } else {
            result += 1;
            let to_swap_index = row.iter().position(|&x| (x as usize) == n - 2).unwrap();
            row.swap(neighbour, to_swap_index);
        }

        let left = std::cmp::min(index_n_1, neighbour);
        let right = std::cmp::max(index_n_1, neighbour);
        let mut newrow = row[..left].to_vec();
        newrow.extend_from_slice(&row[right + 1..]);
        result += Self::dfs_helper(newrow.clone());
        result
    }
}