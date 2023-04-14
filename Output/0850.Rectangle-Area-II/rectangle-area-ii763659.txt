// https://leetcode.com/problems/rectangle-area-ii/solutions/763659/rust-split-rectangles/
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
struct Rect {
    top: i64,
    bottom: i64,
    left: i64,
    right: i64,
}

impl Rect {
    pub fn from_bl_tr(points: Vec<i32>) -> Rect {
        let rect = Rect {
            left: points[0] as i64,
            bottom: points[1] as i64,
            right: points[2] as i64,
            top: points[3] as i64,
        };
        assert!(rect.bottom <= rect.top);
        assert!(rect.left <= rect.right);
        rect
    }

    pub fn new_checked(left: i64, right: i64, bottom: i64, top: i64) -> Option<Rect> {
        if left <= right && bottom <= top {
            Some(Rect {
                left,
                right,
                top,
                bottom,
            })
        } else {
            None
        }
    }

    pub fn area(&self) -> i64 {
        assert!(self.top >= self.bottom);
        assert!(self.right >= self.left);
        (self.top - self.bottom) * (self.right - self.left)
    }

    pub fn to_coords(&self) -> (i64, i64, i64, i64) {
        (self.left, self.bottom, self.right, self.top)
    }

    pub fn area_intersection(&self, other: &Rect) -> i64 {
        self.intersecting_rect(other).map(|r| r.area()).unwrap_or(0)
    }

    pub fn intersecting_rect(&self, other: &Rect) -> Option<Rect> {
        let right = std::cmp::min(self.right, other.right);
        let top = std::cmp::min(self.top, other.top);

        let left = std::cmp::max(self.left, other.left);
        let bottom = std::cmp::max(self.bottom, other.bottom);

        Rect::new_checked(left, right, bottom, top)
    }

    pub fn replacing_y(&self, x: i64) -> Vec<Rect> {
        vec![
            Rect::new_checked(self.left, self.right, x, self.top),
            Rect::new_checked(self.left, self.right, self.bottom, x),
        ]
        .into_iter()
        .filter(Option::is_some)
        .map(|r| r.unwrap())
        .filter(|r| r.area() > 0)
        .collect()
    }

    pub fn replacing_x(&self, x: i64) -> Vec<Rect> {
        vec![
            Rect::new_checked(x, self.right, self.bottom, self.top),
            Rect::new_checked(self.left, x, self.bottom, self.top),
        ]
        .into_iter()
        .filter(Option::is_some)
        .map(|r| r.unwrap())
        .filter(|r| r.area() > 0)
        .collect()
    }
}

/// Splits `rect_b` into rectangles such that none of them overlap with `rect_a`.
/// Note: the order of parameters is important.
fn split(rect_a: Rect, rect_b: Rect) -> Vec<Rect> {
    let rect_overlap = match rect_a.intersecting_rect(&rect_b) {
        // No overlap
        None => return vec![rect_b],
        Some(rect_overlap) => rect_overlap,
    };
    // No overlap.
    let overlap_area = rect_overlap.area();
    if overlap_area == 0 {
        return vec![rect_b];
    }
    // Fully overlapping.
    if overlap_area == rect_b.area() {
        return vec![];
    }

    let mut possible_rects = vec![];
    possible_rects.extend(rect_b.replacing_y(rect_overlap.bottom));
    possible_rects.extend(rect_b.replacing_y(rect_overlap.top));
    possible_rects.extend(rect_b.replacing_x(rect_overlap.left));
    possible_rects.extend(rect_b.replacing_x(rect_overlap.right));

    let in_rect_bs: Vec<Rect> = possible_rects
        .into_iter()
        .filter(|r| r.area_intersection(&rect_a) == 0)
        .collect();

    if in_rect_bs.len() == 1 {
        in_rect_bs
    } else if in_rect_bs.len() == 2 {
        let (in_rect_b_one, in_rect_b_two) = (in_rect_bs[0], in_rect_bs[1]);
        let mut splitted = split(in_rect_b_one, in_rect_b_two);
        splitted.push(in_rect_b_one);
        splitted
    } else if in_rect_bs.len() == 3 {
        let (a, b, c) = (in_rect_bs[0], in_rect_bs[1], in_rect_bs[2]);

        // Keep a, split b.
        let new_b = split(a, b);
        assert!(new_b.len() == 1);
        let b = new_b[0];

        // Keep a, split c.
        let new_c = split(a, c);
        assert!(new_c.len() == 1);
        let c = new_c[0];

        // Keep b, split c.
        let new_c = split(b, c);
        assert!(new_c.len() == 1);
        let c = new_c[0];

        vec![a, b, c]
    } else {
        let to_coords: Vec<_> = in_rect_bs.iter().map(|r| r.to_coords()).collect();
        let a_coors = rect_a.to_coords();
        let b_coors = rect_b.to_coords();
        panic!(
            "Many rects: [{:?}, {:?}]: {:?}",
            a_coors, b_coors, to_coords
        );
    }
}

fn _rectangle_area(mut rects: Vec<Rect>) -> i32 {
    rects.sort_by_key(|r| std::cmp::Reverse(r.area()));

    let mut cur_rects = vec![];
    for new_rect in rects.iter() {
        let mut split_rects = vec![*new_rect];
        for existing_rect in cur_rects.iter() {
            let mut new_split_rects = vec![];
            for split_rect in split_rects {
                new_split_rects.extend(split(*existing_rect, split_rect));
            }
            split_rects = new_split_rects;
        }
        cur_rects.extend(split_rects);
    }

    println!(
        "orig {:?}",
        rects.iter().map(|r| r.to_coords()).collect::<Vec<_>>()
    );
    println!(
        "new {:?}",
        cur_rects.iter().map(|r| r.to_coords()).collect::<Vec<_>>()
    );
    let rects_area: i64 = cur_rects.iter().map(|rect| rect.area()).sum();

    (rects_area % (10i64.pow(9) + 7)) as i32
}

fn rectangle_area(rects: Vec<Vec<i32>>) -> i32 {
    _rectangle_area(
        rects
            .into_iter()
            .map(|bl_tr_coords| Rect::from_bl_tr(bl_tr_coords))
            .collect(),
    )
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_rect_area_ii_simple() {
        let rects = vec![vec![0, 0, 2, 2], vec![1, 0, 2, 3], vec![1, 0, 3, 1]];
        assert_eq!(rectangle_area(rects), 6);

        assert_eq!(
            rectangle_area(vec![vec![0, 0, 10, 10], vec![-5, 7, 3, 15]]),
            155
        );

        assert_eq!(
            rectangle_area(vec![
                vec![57, 25, 94, 44],
                vec![19, 38, 99, 74],
                vec![24, 25, 73, 99],
            ]),
            5015
        );
    }

    #[test]
    fn test_rect_area_ii_complex() {
        let rects = vec![
            vec![84, 21, 92, 84],
            vec![1, 73, 92, 93],
            vec![44, 23, 51, 27],
            vec![32, 57, 54, 60],
            vec![9, 14, 69, 28],
        ];
        assert_eq!(rectangle_area(rects), 3142);
    }
}
