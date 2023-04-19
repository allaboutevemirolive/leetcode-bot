// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/239336/rust-0-ms-dp-solution-with-o-n-time-and-o-1-space/
/*
 典型的动态规划, 我们求以 node_i 为 root 的最大和, 可以下推到求 root 的左右子树, 这里要注意, 路径是不能分叉的, 因此
 我们记 f[node] 为以 node 为根的最大和, 记 g[node] 为 node 为根, *最多连通一侧子树*的最大和

 我们在递推时要用 g[node], f[node] 在递推过程中每次计算一下用于更新 max 即可

 g[node_i] = node_i.val + max(g[node_i.left], g[node_i.right], 0)
 f[node_i] = node_i.val + max(g[node_i.left], 0) + max(g[node_i.right], 0)

 显然, g[None] = 0 (None 即空子树), 最终计算到 g[root] 中止, f 的最大值会在计算过程中出现(注意 f[root] 不一定是最大值)

 每个 node 最大和只依赖与其左右子树的最大和, 因此 Top-down 需要 O(N) 的空间
 Bottom-up 只需要 O(1) 空间 (做后序遍历从叶节点向上递推即可)
 */
use std::rc::Rc;
use std::cell::RefCell;
impl Solution {
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let mut max = i32::min_value();
        Solution::postorder(root.as_ref(), &mut max);
        max
    }

    fn postorder(root: Option<&Rc<RefCell<TreeNode>>>, max: &mut i32) -> i32 {
        if let Some(node) = root {
            let left = Solution::postorder(node.borrow().left.as_ref(), max);
            let right = Solution::postorder(node.borrow().right.as_ref(), max);
            *max = i32::max(node.borrow().val + i32::max(left, 0) + i32::max(right, 0), *max);
            node.borrow().val + i32::max(i32::max(left, right), 0)
        } else {
            0
        }
    }
}