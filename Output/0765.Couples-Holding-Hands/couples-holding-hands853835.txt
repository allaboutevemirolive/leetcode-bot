// https://leetcode.com/problems/couples-holding-hands/solutions/853835/rust-translated-union-find-0ms-100/
struct UnionFind {
    n: usize,
    count: usize,
    parents: Vec<usize>,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        let mut parents = (0..n).collect::<Vec<usize>>();
        UnionFind {
            n,
            count: n,
            parents,
        }
    }

    fn find(&mut self, i: usize) -> usize {
        if self.parents[i] == i {
            return i;
        }
        self.parents[i] = self.find(self.parents[i]);
        self.parents[i]
    }

    fn union(&mut self, i: usize, j: usize) {
        let a = self.find(i);
        let b = self.find(j);
        if a != b {
            self.parents[a] = b;
            self.count -= 1;
        }
    }
}

impl Solution {
    pub fn min_swaps_couples(row: Vec<i32>) -> i32 {
        let n = row.len() / 2;
        let mut uf = UnionFind::new(n);
        for i in 0..n {
            let a = row[i + i];
            let b = row[i + i  + 1];
            uf.union(a as usize / 2, b as usize / 2)
        }
        (n - uf.count) as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_count_swap() {
        assert_eq!(Solution::min_swaps_couples(vec![0, 2, 1, 3]), 1);
    }

    #[test]
    fn test_count_swap_02() {
        assert_eq!(Solution::min_swaps_couples(vec![3, 2, 0, 1]), 0);
    }

    #[test]
    fn test_count_swap_03() {
        assert_eq!(Solution::min_swaps_couples(vec![5,4,2,6,3,1,0,7]), 2);
    }
}