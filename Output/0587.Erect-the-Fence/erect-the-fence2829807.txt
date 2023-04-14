// https://leetcode.com/problems/erect-the-fence/solutions/2829807/rust-intuitive-solution-32-lines-100-runtime-and-memory/
use std::f32::consts::PI;

impl Solution {
    pub fn outer_trees(mut trees: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        // left top point
        let mut ret = vec![trees.iter().min().unwrap().to_owned()];

        let mut prev_angle = 0.;
        loop {
            let prev = ret.last().unwrap();
            let (min_angle_i, (min_angle, _)) = trees
                .iter()
                .enumerate()
                .filter(|(_, t)| ret.len() > 1 || trees.len() == 1 || *t != prev)
                .map(|(i, t)| {
                    // atan2(dx, dy)
                    let mut angle = ((t[0] - prev[0]) as f32).atan2((t[1] - prev[1]) as f32);
                    angle += if angle < 0. { 2. * PI } else { 0. };
                    let dist: i32 = prev.iter().zip(t.iter()).map(|(a, b)| (b - a).pow(2)).sum();
                    (i, (angle, dist))
                })
                .filter(|(_, (angle, _))| *angle >= prev_angle)
                .min_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap())
                .unwrap();

            if trees[min_angle_i] == ret[0] {
                return ret;
            }
            ret.push(trees.remove(min_angle_i));
            prev_angle = min_angle;
        }
    }
}