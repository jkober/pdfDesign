<?php
namespace Design\DesignBundle\Services\PdfExterno3;
trait CrearFuncionTrait {
    public static function create_function($param,$funcion){
        $xx="return function({$param}){ {$funcion} };";
        return eval($xx );
    }
}