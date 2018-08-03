import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
// import Mock from 'mockjs'
import { fetchForgetEmail, fetchForgetCaptcha } from '../../actions/account'
import './RegisterForm.css'

// 倒数计时
const defineNum = process.env.NODE_ENV === 'development'
    ? () => ({
        downNums: 5
    })
    : () => ({
        downNums: 60
    })
// 模拟数据
const mockUser = process.env.NODE_ENV === 'development'
    ? () => ({
        // email: '466145788@qq.com',
        email: '87590842@163.com',
        captcha: '',
        hasSend: false,
        captchaClick: false,
        countdown: '发送验证码',
        nums: defineNum().downNums
    })
    : () => ({
        email: '',
        captcha: '',
        hasSend: false,
        captchaClick: false,
        countdown: '发送验证码',
        nums: defineNum().downNums
    })

// 展示组件
class ForgetForm extends Component {

    constructor(props) {
        super(props)
        this.state = mockUser()
    }
    render() {
        return (
            <section className='RegisterForm'>
                <div className='header'>
                    <span className='title'>忘记密码</span>
                </div>
                <form className='body' onSubmit={this.handleCaptchaSubmit}>
                    <div className='form-group'>
                        <label>邮箱：</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="button-addon2" disabled={this.state.hasSend} required />
                            <div className="input-group-append">
                                <button className="btn btn-primary btn-outline-secondary w120" type="button" id="button-addon2" onClick={this.handleSendEmail} disabled={this.state.captchaClick}>{this.state.countdown}</button>
                            </div>
                        </div>
                        {/* <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className='form-control' placeholder='Email' required />
                        <button type='submit' className='btn btn-primary w140 mr20' disabled={this.state.captchaClick}>{this.state.countdown}</button> */}
                    </div>
                    <div className='form-group'>
                        <label>验证码：</label>
                        <input value={this.state.captcha} onChange={e => this.setState({ captcha: e.target.value })} className='form-control' required />
                    </div>
                    <button type='submit' className='btn btn-primary w140 mr20' disabled={!this.state.hasSend} >确认</button>
                    {this.props.auth.message &&
                        <div className='alert alert-danger fade show' role='alert'>
                            {this.props.auth.message}
                        </div>
                    }
                </form>
            </section>
        )
    }
    handleSendEmail = (e) => {
        let { onFetchForgetEmail } = this.props
        e.preventDefault()
        onFetchForgetEmail(this.state, () => {
            this.setState({
                hasSend: true,
                captchaClick: !this.state.captchaClick,
                countdown: '重新获取(' + this.state.nums + 's)'
            })

            // 倒计时开启
            this.clock = setInterval(
                () => this.doLoop(),
                1000
            );
        })
    }
    handleCaptchaSubmit = (e) => {
        let { history, onFetchForgetCaptcha } = this.props
        e.preventDefault()
        onFetchForgetCaptcha(this.state, () => {
            history.push('/account/update') // 另一种方式是 <Redirect to="/somewhere/else"/>
        })
    }

    // 倒计时实现
    doLoop() {
        var nums = this.state.nums;
        nums--;
        this.setState({
            nums: nums
        });
        if (nums > 0) {
            this.setState({
                countdown: '重新获取(' + nums + 's)'
            });
        }
        else {
            this.resetButton();
        }
    }
    // 按钮重置
    resetButton() {
        clearInterval(this.clock);	// 清除js定时器
        this.setState({
            countdown: '重新获取验证码',
            captchaClick: false,
            nums: defineNum().downNums,	// 重置时间
        });
    }
}

// 容器组件
const mapStateToProps = (state) => ({
    auth: state.auth
})
const mapDispatchToProps = ({
    onFetchForgetEmail: fetchForgetEmail,
    onFetchForgetCaptcha: fetchForgetCaptcha
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgetForm)
