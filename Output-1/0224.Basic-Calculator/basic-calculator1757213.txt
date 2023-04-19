// https://leetcode.com/problems/basic-calculator/solutions/1757213/java-recursion-solution-fast-simple/
class Solution {
    public int calculate(String s) {
        int[] res = calculate(s.replace(" ", ""), 0);
        return res[0];
    }
    int iters = 0;
    private int[] calculate(String expr, int startFrom) {
        int totalSum = 0;
        int curNumber = 0;
        char lastOp = '+';
        int i = startFrom;
        for(; i<expr.length(); i++) {
            iters ++;
            char curr = expr.charAt(i);
            if(Character.isDigit(curr)) {
                curNumber = curNumber * 10 + (curr - '0');
                if(i == expr.length() - 1) {
                    totalSum = applyOp(totalSum, curNumber, lastOp);
                }
            } else if(isOperation(curr)) {
                totalSum = applyOp(totalSum, curNumber, lastOp);
                lastOp = curr;
                curNumber = 0;
            } else if(curr == '(') {
                int[] partialResult = calculate(expr, i+1);
                int partialSum = partialResult[0];
                i = partialResult[1];
                totalSum = applyOp(totalSum, partialSum, lastOp);
            } else if(curr == ')') {
                // finished compute
                totalSum = applyOp(totalSum, curNumber, lastOp);
                break;
            }
        }
        return new int[]{totalSum, i};
    }
    
    private boolean isOperation(char c) {
        return c == '+' || c == '-';
    }
    private int applyOp(int first, int sec, char op) {
        if(op == '+') 
            return first + sec;
        else 
            return first - sec;
    }
}