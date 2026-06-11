import * as yup from 'yup';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { request } from '../../utils';
import { useResetForm } from '../../hooks';
import { Input, H2, Button, AuthFormError } from '../../components';
import { setUser } from '../../actions';
import styled from 'styled-components';
import { selectUserRole } from '../../selectors';
import { ROLE } from '../../constants';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните поле "логин"')
		.matches(/^\w+$/, 'Неверно заполнено поле логин. Допускаются только буквы и цифры')
		.min(3, 'Неверно заполнено поле логин. Минимум 3 символа')
		.max(15, 'Неверно заполнено поле логин. Максимум 15 символов'),
	password: yup
		.string()
		.required('Заполните поле "пароль"')
		.matches(
			/^[\w#%]+$/,
			'Неверно заполнено поле "пароль". Допускаются буквы, цифры и знаки - "#, %"',
		)
		.min(6, 'Неверно заполнено поле пароль. Минимум 6 символов')
		.max(30, 'Неверно заполнено поле пароль. Максимум 30 символов'),
});

const StyledLink = styled(Link)`
	text-align: center;
	text-decoration: underline;
	margin: 20px 0;
	font-size: 18px;
`;

const AuthorizationContainer = ({ className }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		default: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});

	const [serverError, setServerError] = useState(null);

	const dispatch = useDispatch();

	const roleId = useSelector(selectUserRole);

	useResetForm(reset);

	const onSubmit = ({ login, password }) => {
		request('/login', 'POST', { login, password }).then(({ error, user }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			}

			dispatch(setUser(user));
			sessionStorage.setItem('userData', JSON.stringify(user));
		});
	};

	const formError = errors?.login?.message || errors?.password?.message;
	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
			<H2>Авторизация</H2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					placeholder="Логин..."
					{...register('login', {
						onChange: () => setServerError(null),
					})}
				/>
				<Input
					type="password"
					placeholder="Пароль..."
					{...register('password', {
						onChange: () => setServerError(null),
					})}
				/>
				<Button type="submit" disabled={!!formError}>
					Авторизоваться
				</Button>
				{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
				<StyledLink to="/register">Регистрация</StyledLink>
			</form>
		</div>
	);
};

export const Authorization = styled(AuthorizationContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;

	& > form {
		display: flex;
		flex-direction: column;
		width: 260px;
	}
`;
