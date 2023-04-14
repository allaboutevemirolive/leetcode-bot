// https://leetcode.com/problems/erect-the-fence/solutions/2830193/rust-concise-solution/
impl Solution {
    pub fn outer_trees(trees: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let n = trees.len();
        let mut ret = vec![];
        
        let mut trees = trees;
        trees.sort();
        
        for i in 0 .. n {
            while ret.len() > 1 {
                if Self::orientation(&ret[ret.len() - 2], &ret[ret.len() - 1], &trees[i]) { break }
                ret.pop();
            }
            ret.push(trees[i].clone());
        }

        if ret.len() == n { return ret }
        for i in (0 .. n - 1).rev() {
            while ret.len() > 1 {
                if Self::orientation(&ret[ret.len() - 2], &ret[ret.len() - 1], &trees[i]) { break }
                ret.pop();
            }
            ret.push(trees[i].clone());
        }
        ret.pop();

        ret
    }
        
    fn orientation(a: &Vec<i32>, b: &Vec<i32>, c: &Vec<i32>) -> bool {
        (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) >= 0
    }
}