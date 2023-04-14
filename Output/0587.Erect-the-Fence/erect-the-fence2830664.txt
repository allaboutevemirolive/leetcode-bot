// https://leetcode.com/problems/erect-the-fence/solutions/2830664/solution-in-rust/
impl Solution {
    pub fn outer_trees(trees: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        if trees.len() <= 3 {
            return trees;
        }
        let mut trees = trees;
        trees.sort_by(|a, b| a[0].cmp(&b[0]).then(a[1].cmp(&b[1])));
        let mut hull = Vec::new();
        hull.push(trees[0].clone());
        hull.push(trees[1].clone());
        for i in 2..trees.len() {
            while hull.len() > 1 && Solution::cross(&hull[hull.len() - 2], &hull[hull.len() - 1], &trees[i]) < 0 {
                hull.pop();
            }
            hull.push(trees[i].clone());
        }
        let mut hull2 = Vec::new();
        hull2.push(trees[trees.len() - 1].clone());
        hull2.push(trees[trees.len() - 2].clone());
        for i in (0..trees.len() - 2).rev() {
            while hull2.len() > 1 && Solution::cross(&hull2[hull2.len() - 2], &hull2[hull2.len() - 1], &trees[i]) < 0 {
                hull2.pop();
            }
            hull2.push(trees[i].clone());
        }
        hull.pop();
        hull2.pop();
        hull.append(&mut hull2);
        hull.sort_by(|a, b| a[0].cmp(&b[0]).then(a[1].cmp(&b[1])));
        hull.dedup();
        hull


    }

    fn cross(a: &Vec<i32>, b: &Vec<i32>, c: &Vec<i32>) -> i32 {
        (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    }
}
