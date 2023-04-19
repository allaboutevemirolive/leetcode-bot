// https://leetcode.com/problems/maximal-rectangle/solutions/1603813/rust-solution/
impl Solution {
    pub fn maximal_rectangle(matrix: Vec<Vec<char>>) -> i32 {
        (0..matrix.len())
            .flat_map(|i| {
                matrix[i..]
                    .iter()
                    .enumerate()
                    .scan(vec![true; matrix[0].len()], |cur, (j, row)| {
                        for (x, &c) in cur.iter_mut().zip(row) {
                            *x &= c == '1';
                        }

                        cur.iter()
                            .enumerate()
                            .scan(0, |prev, (i, &x)| {
                                Some(if x {
                                    Some(i - *prev + 1)
                                } else {
                                    *prev = i + 1;
                                    None
                                })
                            })
                            .flatten()
                            .max()
                            .map(|w| w * (j + 1))
                    })
            })
            .max()
            .map_or(0, |ans| ans as _)
    }
}