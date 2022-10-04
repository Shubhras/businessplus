@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/login_access_tokens') }}">Login access token</a> :
@endsection
@section("contentheader_description", $login_access_token->$view_col)
@section("section", "Login access tokens")
@section("section_url", url(config('laraadmin.adminRoute') . '/login_access_tokens'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Login access tokens Edit : ".$login_access_token->$view_col)

@section("main-content")

@if (count($errors) > 0)
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="box">
	<div class="box-header">
		
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-md-8 col-md-offset-2">
				{!! Form::model($login_access_token, ['route' => [config('laraadmin.adminRoute') . '.login_access_tokens.update', $login_access_token->id ], 'method'=>'PUT', 'id' => 'login_access_token-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'user_id')
					@la_input($module, 'access_token')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/login_access_tokens') }}">Cancel</a></button>
					</div>
				{!! Form::close() !!}
			</div>
		</div>
	</div>
</div>

@endsection

@push('scripts')
<script>
$(function () {
	$("#login_access_token-edit-form").validate({
		
	});
});
</script>
@endpush
