@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/kpi_comments') }}">Kpi comment</a> :
@endsection
@section("contentheader_description", $kpi_comment->$view_col)
@section("section", "Kpi comments")
@section("section_url", url(config('laraadmin.adminRoute') . '/kpi_comments'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Kpi comments Edit : ".$kpi_comment->$view_col)

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
				{!! Form::model($kpi_comment, ['route' => [config('laraadmin.adminRoute') . '.kpi_comments.update', $kpi_comment->id ], 'method'=>'PUT', 'id' => 'kpi_comment-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'kpi_id')
					@la_input($module, 'year')
					@la_input($module, 'month')
					@la_input($module, 'comment')
					@la_input($module, 'recovery_plan')
					@la_input($module, 'responsibility')
					@la_input($module, 'target_date')
					@la_input($module, 'status')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/kpi_comments') }}">Cancel</a></button>
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
	$("#kpi_comment-edit-form").validate({
		
	});
});
</script>
@endpush
