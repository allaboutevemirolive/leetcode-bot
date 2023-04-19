// https://leetcode.com/problems/max-points-on-a-line/solutions/3020902/rust-o-n-2-log-n/
impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        if points.len() < 2{
            return points.len() as i32;
        }

        let mut max_points = 0;
        let mut gradients = vec![];

        for p1 in points.iter(){
            let mut same_line = 2;
            max_points = max_points.max(same_line);


            for p2 in points.iter(){
                if p1 != p2{
                    gradients.push(get_gradient(p1, p2));
                }
            }

            gradients.sort_unstable_by(|a, b| a.partial_cmp(&b).unwrap());
            // println!("{:?}; g: {:?}", p1, &gradients);
            
            for v in gradients.windows(2){
                let (a, b) = (v[0], v[1]);

                if a == b{
                    same_line +=1;
                    max_points = max_points.max(same_line);
                }else{
                    same_line = 2;
                }
                // println!("({}, {}){:?}, {:?}", a, b, same_line, max_points);
            }

            gradients.clear();
        }

        max_points
    }
}

fn get_gradient(a: &Vec<i32>, b: &Vec<i32>) -> f64{
        let diff_y = (b[1] - a[1]) as f64;
        let diff_x = (b[0] - a[0]) as f64;

        if diff_x == 0f64{
            f64::INFINITY
        }else{
            diff_y / diff_x
        }
    }