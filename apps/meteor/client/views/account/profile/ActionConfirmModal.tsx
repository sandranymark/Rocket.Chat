import {
	Box,
	PasswordInput,
	TextInput,
	FieldGroup,
	Field,
	FieldRow,
	FieldError,
} from '@rocket.chat/fuselage';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';

import GenericModal from '../../../components/GenericModal';

type ActionConfirmModalProps = {
	isPassword: boolean;
	onConfirm: (input: string, setInputError: (msg: string) => void) => void;
	onCancel: () => void;
};

const ActionConfirmModal = ({ isPassword, onConfirm, onCancel }: ActionConfirmModalProps) => {
	const { t } = useTranslation();
	const actionTextId = useId();

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<{ credential: string }>({
		defaultValues: { credential: '' },
		mode: 'onBlur',
	});

	const handleSave = handleSubmit(({ credential }) => {
		onConfirm(credential, (msg) => {
			if (msg) {
				setError('credential', { message: msg });
			}
		});
	});

	return (
		<GenericModal
			wrapperFunction={(props) => <Box is='form' onSubmit={handleSave} {...props} />}
			onClose={onCancel}
			onConfirm={handleSave}
			onCancel={onCancel}
			variant='danger'
			title={t('Delete_account?')}
			confirmText={t('Delete_account')}
		>
			<Box mb={8} id={actionTextId}>
				{isPassword
					? t('Enter_your_password_to_delete_your_account')
					: t('Enter_your_username_to_delete_your_account')}
			</Box>

			<FieldGroup w='full'>
				<Field>
					<FieldRow>
						<Controller
							name='credential'
							control={control}
							rules={{ required: t('Invalid_field') }}
							render={({ field }) =>
								isPassword ? (
									<PasswordInput
										{...field}
										aria-labelledby={actionTextId}
										aria-invalid={Boolean(errors.credential)}
									/>
								) : (
									<TextInput
										{...field}
										aria-labelledby={actionTextId}
										aria-invalid={Boolean(errors.credential)}
									/>
								)
							}
						/>
					</FieldRow>
					{errors.credential && (
						<FieldError aria-live="assertive">{errors.credential.message}</FieldError>
					)}
				</Field>
			</FieldGroup>
		</GenericModal>
	);
};

export default ActionConfirmModal;
